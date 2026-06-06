import { app } from './src/server/app';
import path from 'path';
import express from 'express';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

// For Vercel Serverless, we do NOT run app.listen().
// We also don't need Vite server middleware.
// If it's running locally via `npm run dev` or `npm start`
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = Number(process.env.PORT || 3000);
  import('vite').then(({ createServer: createViteServer }) => {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then(vite => {
      app.use(vite.middlewares);

      app.listen(PORT, "0.0.0.0", () => {
        logger.info(`Server running on http://localhost:${PORT}`);
      });
    });
  });
} else if (!process.env.VERCEL) {
  // Local production build via `npm start`
  const PORT = Number(process.env.PORT || 3000);
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}
