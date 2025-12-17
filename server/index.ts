import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createFirstAdmin } from "./createAdmin";
import { initialize as initializeDb } from "./db";

const app = express();

// CORS middleware
app.use((req, res, next) => {
  const origin = process.env.ALLOWED_ORIGIN || (process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', origin !== '*');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Устанавливаем правильную кодировку только для API-ответов
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }
  next();
});

// Логирование запросов
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  console.log(`\n=== Incoming Request ===`);
  console.log(`${req.method} ${path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`\n=== Response ===`);
    console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    if (capturedJsonResponse) {
      console.log('Response body:', capturedJsonResponse);
    }
  });

  next();
});

(async () => {
  try {
    // Инициализируем базу данных
    await initializeDb();
    
    const server = await registerRoutes(app);

    // Create first admin user on startup
    try {
      await createFirstAdmin();
    } catch (error) {
      log("Предупреждение: Не удалось создать первого администратора");
    }

    // Глобальный обработчик ошибок
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('\n=== Error Handler ===');
      console.error('Error:', err);
      
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ 
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Use PORT from environment variable (Render sets this automatically)
    // Fallback to 3000 for local development
    const port = process.env.PORT || 3000;
    server.listen(port, '0.0.0.0', () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
