import { Router, Response } from 'express';
import { getAllProducts, getProductById, hasUserEntitlement } from '../db';
import { optionalAuth, AuthRequest } from '../auth';

export const productRouter = Router();

// GET /api/products
// Publicly accessible complete PDF payment catalog
productRouter.get('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const products = getAllProducts().filter(p => p.isPublished);
    const userId = req.user?.id;

    // Sanitize response: strip private storage keys & server paths
    const sanitized = products.map(p => {
      const isPurchased = userId ? hasUserEntitlement(userId, p.id) : false;
      return {
        id: p.id,
        serialNumber: p.serialNumber,
        title: p.title,
        subject: p.subject,
        category: p.category,
        description: p.description,
        pageCount: p.pageCount,
        originalPriceINR: p.originalPriceINR,
        discountPriceINR: p.discountPriceINR,
        finalPriceINR: p.finalPriceINR,
        fileSizeBytes: p.fileSizeBytes,
        coverGradient: p.coverGradient,
        isPurchased,
        demoPagesAvailable: Math.min(2, p.pageCount),
      };
    });

    res.json({
      products: sanitized,
      count: sanitized.length,
      isAuthenticated: !!req.user,
      currency: 'INR',
    });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch PDF payment catalog.' });
  }
});

// GET /api/products/:id
productRouter.get('/:id', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const p = getProductById(id);
    if (!p || !p.isPublished) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const userId = req.user?.id;
    const isPurchased = userId ? hasUserEntitlement(userId, p.id) : false;

    res.json({
      id: p.id,
      serialNumber: p.serialNumber,
      title: p.title,
      subject: p.subject,
      category: p.category,
      description: p.description,
      pageCount: p.pageCount,
      originalPriceINR: p.originalPriceINR,
      discountPriceINR: p.discountPriceINR,
      finalPriceINR: p.finalPriceINR,
      fileSizeBytes: p.fileSizeBytes,
      coverGradient: p.coverGradient,
      isPurchased,
      demoPagesAvailable: Math.min(2, p.pageCount),
    });
  } catch (err: any) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product details.' });
  }
});
