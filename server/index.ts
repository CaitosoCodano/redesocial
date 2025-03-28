import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, setupVite, log } from "./vite";

const PORT = process.env.PORT || 3000;

async function main() {
  const app = express();
  
  // Parse JSON body
  app.use(express.json());

  // Register API routes
  const server = await registerRoutes(app);
  
  if (process.env.NODE_ENV === "production") {
    // For serving static files in production
    serveStatic(app);
  } else {
    // Setup Vite dev server in development
    await setupVite(app, server);
  }

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "production" ? null : err.message,
    });
  });

  server.listen(PORT, { host: '127.0.0.1' }, () => {
    log(`serving on port ${PORT} at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});''
