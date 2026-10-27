import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderById,
  updateOrder,
  revokeEntitlement,
  getAllEntitlements,
  getAuditLogs,
  addAuditLog,
  PRIVATE_PDF_DIR,
  Product,
} from '../db';
import { requireAdmin, AuthRequest } from '../auth';
import { runSecuritySuite } from '../securityTests';
import { generateRealCivilEngineeringPdf } from '../seedData';

export const adminRouter = Router();

// Configure Multer for uploading PDFs to private storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PRIVATE_PDF_DIR);
  },
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are permitted for upload.'));
    }
  },
});

// All routes here require Administrator privileges
adminRouter.use(requireAdmin);

// 1. GET /api/admin/stats
adminRouter.get('/stats', (_req: AuthRequest, res: Response) => {
  try {
    const products = getAllProducts();
    const orders = getAllOrders();
    const entitlements = getAllEntitlements();
    const paidOrders = orders.filter(o => o.status === 'paid');
    const totalRevenueINR = paidOrders.reduce((sum, o) => sum + (o.amountINR || 0), 0);

    res.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      paidOrdersCount: paidOrders.length,
      activeEntitlementsCount: entitlements.filter(e => e.status === 'active').length,
      totalRevenueINR,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

// 2. GET /api/admin/products
adminRouter.get('/products', (_req: AuthRequest, res: Response) => {
  try {
    const products = getAllProducts();
    res.json({ products });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load products.' });
  }
});

// 3. POST /api/admin/products (Upload new PDF product)
adminRouter.post('/products', upload.single('pdfFile'), (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const file = req.file;
    const {
      title,
      subject,
      category,
      description,
      pageCount,
      originalPriceINR,
      discountPriceINR,
      serialNumber,
    } = req.body;

    if (!title || !subject) {
      res.status(400).json({ error: 'Title and subject are required.' });
      return;
    }

    const storageKey = file ? file.filename : `custom_notes_${Date.now()}.pdf`;

    // If no file uploaded, generate real civil engineering PDF in private storage
    if (!file) {
      const realPdfBuf = generateRealCivilEngineeringPdf(
        String(title).trim(),
        String(subject).trim(),
        String(category || 'General Civil Notes').trim(),
        `prod_${Date.now()}`,
        Number(pageCount) || 6
      );
      const targetPath = path.join(PRIVATE_PDF_DIR, storageKey);
      fs.writeFileSync(targetPath, realPdfBuf);
    }

    const origPrice = Number(originalPriceINR) || 99;
    const discPrice = Number(discountPriceINR) || 0;
    const finalPrice = Math.max(0, origPrice - discPrice);

    const newProd: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      serialNumber: Number(serialNumber) || (getAllProducts().length + 1),
      title: String(title).trim(),
      subject: String(subject).trim(),
      category: String(category || 'General Civil Notes').trim(),
      description: String(description || 'Civil engineering academic and distinction notes.').trim(),
      pageCount: Number(pageCount) || 50,
      originalPriceINR: origPrice,
      discountPriceINR: discPrice,
      finalPriceINR: finalPrice,
      storageKey,
      fileSizeBytes: file ? file.size : 1024 * 50,
      coverGradient: 'from-blue-700 via-indigo-800 to-slate-900',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProduct(newProd);
    addAuditLog('PRODUCT_CREATED', user.email, `Created product ${newProd.title} (₹${finalPrice})`, newProd.id);

    res.status(201).json({ success: true, product: newProd });
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// 4. PUT /api/admin/products/:id (Update product details and optionally replace PDF file)
adminRouter.put('/products/:id', upload.single('pdfFile'), (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const updates = { ...req.body };
    const file = req.file;

    const existing = getProductById(id);
    if (!existing) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    // Convert string numbers if sent via FormData
    if (updates.originalPriceINR !== undefined) updates.originalPriceINR = Number(updates.originalPriceINR);
    if (updates.discountPriceINR !== undefined) updates.discountPriceINR = Number(updates.discountPriceINR);
    if (updates.pageCount !== undefined) updates.pageCount = Number(updates.pageCount);
    if (updates.serialNumber !== undefined) updates.serialNumber = Number(updates.serialNumber);

    // If replacement PDF uploaded, update storageKey and file size
    if (file) {
      updates.storageKey = file.filename;
      updates.fileSizeBytes = file.size;
    }

    const updated = updateProduct(id, updates);
    addAuditLog('PRODUCT_UPDATED', user.email, `Updated product ${existing.title}`, id);

    res.json({ success: true, product: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// 5. POST /api/admin/products/:id/replace-pdf (Dedicated endpoint to change the real PDF file)
adminRouter.post('/products/:id/replace-pdf', upload.single('pdfFile'), (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'Please select a valid PDF file to upload.' });
      return;
    }

    const existing = getProductById(id);
    if (!existing) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const updated = updateProduct(id, {
      storageKey: file.filename,
      fileSizeBytes: file.size,
    });

    addAuditLog(
      'PDF_FILE_REPLACED',
      user.email,
      `Replaced PDF for product ${existing.title} with new file: ${file.originalname} (${file.size} bytes)`,
      id
    );

    res.json({
      success: true,
      message: `Successfully replaced real PDF for ${existing.title}!`,
      product: updated,
    });
  } catch (err: any) {
    console.error('Error replacing PDF:', err);
    res.status(500).json({ error: 'Failed to replace PDF file.' });
  }
});

// 6. POST /api/admin/products/:id/regenerate-pdf (Regenerate rich authentic civil engineering PDF)
adminRouter.post('/products/:id/regenerate-pdf', (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const existing = getProductById(id);
    if (!existing) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const realPdfBuf = generateRealCivilEngineeringPdf(
      existing.title,
      existing.subject,
      existing.category,
      existing.id,
      6
    );

    const storageKey = existing.storageKey || `${existing.id}.pdf`;
    const targetPath = path.join(PRIVATE_PDF_DIR, storageKey);
    fs.writeFileSync(targetPath, realPdfBuf);

    const updated = updateProduct(id, {
      storageKey,
      fileSizeBytes: realPdfBuf.length,
    });

    addAuditLog(
      'PDF_REGENERATED',
      user.email,
      `Regenerated high-fidelity real technical PDF for ${existing.title} (${realPdfBuf.length} bytes)`,
      id
    );

    res.json({
      success: true,
      message: `Successfully regenerated real civil engineering PDF for ${existing.title}!`,
      product: updated,
    });
  } catch (err: any) {
    console.error('Error regenerating PDF:', err);
    res.status(500).json({ error: 'Failed to regenerate PDF.' });
  }
});

// 7. DELETE /api/admin/products/:id
adminRouter.delete('/products/:id', (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const prod = getProductById(id);
    if (!prod) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    deleteProduct(id);
    addAuditLog('PRODUCT_DELETED', user.email, `Deleted product ${prod.title}`, id);
    res.json({ success: true, message: 'Product removed.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// 8. GET /api/admin/orders
adminRouter.get('/orders', (_req: AuthRequest, res: Response) => {
  try {
    const orders = getAllOrders();
    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load orders.' });
  }
});

// 9. POST /api/admin/orders/:id/refund
adminRouter.post('/orders/:id/refund', (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const order = getOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    updateOrder(order.id, {
      status: 'refunded',
      refundedAt: new Date().toISOString(),
    });

    revokeEntitlement(order.id);
    addAuditLog('ORDER_REFUNDED', user.email, `Refunded order ${order.orderNumber} and revoked entitlement`, order.id);

    res.json({ success: true, message: `Order ${order.orderNumber} marked as refunded and access revoked.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to refund order.' });
  }
});

// 10. GET /api/admin/audit-logs
adminRouter.get('/audit-logs', (_req: AuthRequest, res: Response) => {
  try {
    const logs = getAuditLogs();
    res.json({ logs });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

// 11. POST /api/admin/run-security-tests
adminRouter.post('/run-security-tests', async (_req: AuthRequest, res: Response) => {
  try {
    const results = await runSecuritySuite();
    res.json(results);
  } catch (err: any) {
    console.error('Security test runner error:', err);
    res.status(500).json({ error: 'Security test execution failed.' });
  }
});
