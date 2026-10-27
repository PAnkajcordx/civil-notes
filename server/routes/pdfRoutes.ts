import { Router, Response } from 'express';
import fs from 'fs';
import path from 'path';
import {
  getProductById,
  hasUserEntitlement,
  PRIVATE_PDF_DIR,
  addAuditLog,
} from '../db';
import { requireAuth, optionalAuth, AuthRequest } from '../auth';

export const pdfRouter = Router();

/**
 * 1. GET /api/pdfs/:productId/view
 * - Requires active purchase entitlement or admin role
 * - Streams PDF with inline disposition
 */
pdfRouter.get('/:productId/view', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { productId } = req.params;

    const product = getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Requested PDF document not found.' });
      return;
    }

    // Strict entitlement verification: Must be purchased or user is Admin
    const isEntitled = hasUserEntitlement(user.id, product.id) || user.role === 'admin';
    if (!isEntitled) {
      addAuditLog(
        'UNAUTHORIZED_PDF_ACCESS_BLOCKED',
        user.email,
        `Attempted to view unpurchased PDF ${product.title} (${product.id})`,
        product.id
      );
      res.status(403).json({
        error: 'Access denied: You have not purchased this PDF yet. Please complete checkout to unlock.',
        requiresPurchase: true,
        productId: product.id,
        priceINR: product.finalPriceINR,
      });
      return;
    }

    const filePath = path.join(PRIVATE_PDF_DIR, product.storageKey);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'PDF file is temporarily unavailable on storage.' });
      return;
    }

    addAuditLog(
      'PDF_VIEWED',
      user.email,
      `Viewed PDF document: ${product.title}`,
      product.id
    );

    const stat = fs.statSync(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(product.storageKey)}"`);
    res.setHeader('Cache-Control', 'private, no-transform, max-age=0, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err: any) {
    console.error('Error streaming PDF for view:', err);
    res.status(500).json({ error: 'Failed to stream protected PDF document.' });
  }
});

/**
 * 2. GET /api/pdfs/:productId/download
 * - Requires active purchase entitlement or admin role
 * - Streams PDF as attachment download
 */
pdfRouter.get('/:productId/download', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { productId } = req.params;

    const product = getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Requested PDF document not found.' });
      return;
    }

    const isEntitled = hasUserEntitlement(user.id, product.id) || user.role === 'admin';
    if (!isEntitled) {
      addAuditLog(
        'UNAUTHORIZED_DOWNLOAD_BLOCKED',
        user.email,
        `Attempted to download unpurchased PDF ${product.title} (${product.id})`,
        product.id
      );
      res.status(403).json({
        error: 'Access denied: You have not purchased this PDF yet.',
        requiresPurchase: true,
        productId: product.id,
      });
      return;
    }

    const filePath = path.join(PRIVATE_PDF_DIR, product.storageKey);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'PDF file is temporarily unavailable on storage.' });
      return;
    }

    addAuditLog(
      'PDF_DOWNLOADED',
      user.email,
      `Downloaded PDF document: ${product.title}`,
      product.id
    );

    const safeFilename = `${product.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Cache-Control', 'private, no-transform, max-age=0, must-revalidate');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err: any) {
    console.error('Error downloading PDF:', err);
    res.status(500).json({ error: 'Failed to download protected PDF document.' });
  }
});

/**
 * 3. GET /api/pdfs/:productId/demo
 * - Publicly accessible preview: sends free sample content / metadata for preview mode
 */
pdfRouter.get('/:productId/demo', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const product = getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.json({
      productId: product.id,
      title: product.title,
      subject: product.subject,
      category: product.category,
      totalPageCount: product.pageCount,
      demoPageLimit: 2,
      priceINR: product.finalPriceINR,
      demoPages: [
        {
          pageNumber: 1,
          title: `${product.title} - Overview & Table of Contents`,
          sampleText: `CivilNotes Distinction Coursework Series\nDiscipline: ${product.subject}\n\nContents:\n1. Limit State Design & Mechanics\n2. BS EN 1990 Eurocode Structural Basis\n3. Material Safety Factors & Characteristic Loads\n4. Numerical Calculations and Worked Examples\n\n[Free Sample Preview - Unlock all ${product.pageCount} pages for ₹${product.finalPriceINR}]`,
        },
        {
          pageNumber: 2,
          title: `Core Formulae & Design Checks`,
          sampleText: `Design Bending Moment: M_Ed = (1.35 * G_k + 1.5 * Q_k) * L^2 / 8\nAllowable Deflection: span / 250\nShear Stress Check: tau = V_Ed / (b * d) <= tau_allowable\n\n[Free Sample Preview Page 2 - Pages 3 to ${product.pageCount} are protected]`,
        },
      ],
    });
  } catch (err: any) {
    console.error('Error fetching demo:', err);
    res.status(500).json({ error: 'Failed to load demo.' });
  }
});
