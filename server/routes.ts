import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, loginSchema, registerSchema, contactSchema, insertClientSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Токен доступа отсутствует" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Недействительный токен" });
  }
};

// Middleware to check admin privileges
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Требуются права администратора" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Пользователь с таким email уже существует" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        message: "Регистрация успешна",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Ошибка валидации", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log("\n=== Login Request ===");
      console.log("Request headers:", JSON.stringify(req.headers, null, 2));
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      const data = loginSchema.parse(req.body);
      console.log("Validated login data:", JSON.stringify({ ...data, password: '[HIDDEN]' }, null, 2));
      
      // Find user
      console.log("Looking up user in database...");
      const user = await storage.getUserByEmail(data.email);
      console.log("User lookup result:", user ? { ...user, password: '[HIDDEN]' } : 'User not found');
      
      if (!user) {
        console.log("Authentication failed: User not found");
        return res.status(401).json({ message: "Неверный email или пароль" });
      }

      // Verify password
      console.log("Verifying password...");
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      console.log("Password validation result:", isValidPassword);
      
      if (!isValidPassword) {
        console.log("Authentication failed: Invalid password");
        return res.status(401).json({ message: "Неверный email или пароль" });
      }

      // Generate JWT token
      console.log("Generating JWT token...");
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      console.log("JWT token generated successfully");

      const response = {
        message: "Вход выполнен успешно",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        },
      };
      
      console.log("Sending response:", {
        ...response,
        token: '[HIDDEN]',
        user: {
          ...response.user,
          email: '[HIDDEN]'
        }
      });
      
      return res.status(200).json(response);
    } catch (error: any) {
      console.error("\n=== Login Error ===");
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        detail: error.detail
      });
      
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          message: "Ошибка валидации", 
          errors: error.errors 
        });
      }
      
      console.error("Unexpected error during login:", error);
      return res.status(500).json({ 
        message: "Внутренняя ошибка сервера", 
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
      });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        isAdmin: req.user.isAdmin,
      },
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Выход выполнен успешно" });
  });

  // Client routes (admin only)
  app.get("/api/clients", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const {
        search,
        status,
        page = 1,
        limit = 10,
        sortBy = 'registrationDate',
        sortOrder = 'desc'
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const result = await storage.getClients({
        search: search as string,
        status: status as string,
        limit: parseInt(limit),
        offset,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.json({
        clients: result.clients,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit)),
      });
    } catch (error) {
      console.error("Get clients error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  app.get("/api/clients/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      
      if (!client) {
        return res.status(404).json({ message: "Клиент не найден" });
      }

      res.json(client);
    } catch (error) {
      console.error("Get client error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  app.post("/api/clients", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const data = insertClientSchema.parse(req.body);
      
      const client = await storage.createClient(data, req.user.id);
      
      res.status(201).json({
        message: "Клиент успешно создан",
        client,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Ошибка валидации", errors: error.errors });
      }
      console.error("Create client error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  app.put("/api/clients/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertClientSchema.partial().parse(req.body);
      
      const client = await storage.updateClient(id, data);
      
      if (!client) {
        return res.status(404).json({ message: "Клиент не найден" });
      }

      res.json({
        message: "Клиент успешно обновлен",
        client,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Ошибка валидации", errors: error.errors });
      }
      console.error("Update client error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  app.delete("/api/clients/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClient(id);
      
      if (!success) {
        return res.status(404).json({ message: "Клиент не найден" });
      }

      res.json({ message: "Клиент успешно удален" });
    } catch (error) {
      console.error("Delete client error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  // Admin routes for user management
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      console.log("GET /api/admin/users - Request headers:", req.headers);
      console.log("GET /api/admin/users - Authenticated user:", req.user);

      const {
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      console.log("GET /api/admin/users - Query params:", { search, page, limit, sortBy, sortOrder });

      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const result = await storage.getUsers({
        search: search as string,
        limit: parseInt(limit),
        offset,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      console.log("GET /api/admin/users - Result:", { 
        totalUsers: result.total,
        returnedUsers: result.users.length 
      });

      res.json({
        users: result.users,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit)),
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  app.get("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  app.put("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      const user = await storage.updateUser(id, data);
      
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json({
        message: "Пользователь успешно обновлен",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Prevent admin from deleting themselves
      if (id === req.user.id) {
        return res.status(400).json({ message: "Нельзя удалить самого себя" });
      }
      
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      res.json({ message: "Пользователь успешно удален" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  // Admin statistics
  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  // Contact form route
  app.post("/api/contact", async (req, res) => {
    try {
      console.log("Received contact form data:", req.body);
      
      const data = contactSchema.parse(req.body);
      console.log("Validated contact form data:", data);
      
      // Create a client record from the contact form submission
      try {
        // Find or create admin user to assign as creator
        const adminUser = await storage.getUserByEmail("admin@pension.ru");
        console.log("Found admin user:", adminUser?.id);
        
        const createdBy = adminUser ? adminUser.id : 1; // fallback to ID 1
        
        // Convert contact form data to client format
        const clientData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          birthDate: "1980-01-01", // placeholder date - will be updated by admin
          status: "pending" as const,
          message: data.message,
        };
        
        // Create client record
        const client = await storage.createClient(clientData, createdBy);
        console.log("Created new client from contact form:", client.id);
        
      } catch (clientError) {
        console.error("Failed to create client from contact form:", clientError);
        // Continue with form submission even if client creation fails
      }
      
      res.json({ message: "Сообщение отправлено успешно. Заявка принята в обработку." });
    } catch (error) {
      console.error("Contact form validation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Ошибка валидации", errors: error.errors });
      }
      console.error("Contact form server error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  // Clear clients table (admin only)
  app.post("/api/admin/clients/clear", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      await storage.clearClients();
      res.json({ message: "Таблица клиентов успешно очищена" });
    } catch (error) {
      console.error("Clear clients error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
