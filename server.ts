import express from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { seedInitialData } from './server/seedData';
import { authRouter } from './server/routes/authRoutes';
import { productRouter } from './server/routes/productRoutes';
import { paymentRouter } from './server/routes/paymentRoutes';
import { pdfRouter } from './server/routes/pdfRoutes';
import { adminRouter } from './server/routes/adminRoutes';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Seed database and create sample PDF documents in storage/private_pdfs
  seedInitialData();

  // Raw body buffer preservation for Razorpay webhook HMAC validation
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Mount API routers
  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);
  app.use('/api/payment', paymentRouter);
  app.use('/api/pdfs', pdfRouter);
  app.use('/api/admin', adminRouter);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'CivilNotes Secure PDF Selling Platform',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      currency: 'INR',
    });
  });

  if (!isProduction) {
    // Development mode: mount Vite dev server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built static files from dist
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CivilNotes] Server running securely on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[CivilNotes] Failed to start server:', err);
  process.exit(1);
});
