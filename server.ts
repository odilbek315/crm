import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './src/server/routes/auth';
import { customersRouter } from './src/server/routes/customers';
import { dealsRouter } from './src/server/routes/deals';
import { workflowsRouter } from './src/server/routes/workflows';
import { financeRouter } from './src/server/routes/finance';
import { analyticsRouter } from './src/server/routes/analytics';
import { leadsRouter } from './src/server/routes/leads';
import { tasksRouter } from './src/server/routes/tasks';
import { employeesRouter } from './src/server/routes/employees';
import { productsRouter } from './src/server/routes/products';
import { documentsRouter } from './src/server/routes/documents';
import { auditLogsRouter } from './src/server/routes/auditLogs';
import { approvalsRouter } from './src/server/routes/approvals';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRouter);
  app.use("/api/customers", customersRouter);
  app.use("/api/deals", dealsRouter);
  app.use("/api/workflows", workflowsRouter);
  app.use("/api/finance", financeRouter);
  app.use("/api/invoices", financeRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/ai", analyticsRouter);
  app.use("/api/leads", leadsRouter);
  app.use("/api/tasks", tasksRouter);
  app.use("/api/employees", employeesRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/documents", documentsRouter);
  app.use("/api/audit-logs", auditLogsRouter);
  app.use("/api/approvals", approvalsRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
