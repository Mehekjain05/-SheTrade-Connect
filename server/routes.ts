import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

import {
  insertUserSchema,
  insertProductSchema,
  insertForumPostSchema
} from "@shared/schema";

// Helper for handling async routes
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", asyncHandler(async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      throw error;
    }
  }));

  app.post("/api/auth/login", asyncHandler(async (req: Request, res: Response) => {
    const loginSchema = z.object({
      username: z.string(),
      password: z.string()
    });
    
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we would use proper authentication with JWTs or sessions
      // For now, just return the user without the password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      throw error;
    }
  }));

  app.get("/api/users/:id", asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  }));

  // Product routes
  app.get("/api/products", asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.query.userId as string);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const products = await storage.getProducts(userId);
    res.json(products);
  }));

  app.post("/api/products", asyncHandler(async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      throw error;
    }
  }));

  app.put("/api/products/:id", asyncHandler(async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    try {
      // Partial validation of the product data
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(productId, productData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      throw error;
    }
  }));

  app.delete("/api/products/:id", asyncHandler(async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    const success = await storage.deleteProduct(productId);
    
    if (!success) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(204).end();
  }));

  // Supplier routes
  app.get("/api/suppliers", asyncHandler(async (req: Request, res: Response) => {
    const suppliers = await storage.getSuppliers();
    res.json(suppliers);
  }));

  app.get("/api/suppliers/recommended", asyncHandler(async (req: Request, res: Response) => {
    const suppliers = await storage.getRecommendedSuppliers();
    res.json(suppliers);
  }));

  // Procurement routes
  app.get("/api/procurements", asyncHandler(async (req: Request, res: Response) => {
    const procurements = await storage.getProcurements();
    res.json(procurements);
  }));

  app.get("/api/procurements/recommended", asyncHandler(async (req: Request, res: Response) => {
    const procurements = await storage.getRecommendedProcurements();
    res.json(procurements);
  }));

  // Financial offer routes
  app.get("/api/financial-offers", asyncHandler(async (req: Request, res: Response) => {
    const offers = await storage.getFinancialOffers();
    res.json(offers);
  }));

  app.get("/api/financial-offers/recommended", asyncHandler(async (req: Request, res: Response) => {
    const offers = await storage.getRecommendedFinancialOffers();
    res.json(offers);
  }));

  // Forum post routes
  app.get("/api/forum-posts", asyncHandler(async (req: Request, res: Response) => {
    const posts = await storage.getForumPosts();
    res.json(posts);
  }));

  app.post("/api/forum-posts", asyncHandler(async (req: Request, res: Response) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      throw error;
    }
  }));

  // Learning resource routes
  app.get("/api/learning-resources", asyncHandler(async (req: Request, res: Response) => {
    const resources = await storage.getLearningResources();
    res.json(resources);
  }));

  app.get("/api/learning-resources/recommended", asyncHandler(async (req: Request, res: Response) => {
    const resources = await storage.getRecommendedLearningResources();
    res.json(resources);
  }));

  // Metrics routes
  app.get("/api/metrics/:userId", asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const metrics = await storage.getMetrics(userId);
    
    if (!metrics) {
      return res.status(404).json({ message: "Metrics not found" });
    }
    
    res.json(metrics);
  }));

  // Storefront routes
  app.get("/api/storefronts/:userId", asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const storefront = await storage.getStorefront(userId);
    
    if (!storefront) {
      return res.status(404).json({ message: "Storefront not found" });
    }
    
    res.json(storefront);
  }));

  app.put("/api/storefronts/:userId", asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const storefront = await storage.updateStorefront(userId, req.body);
    res.json(storefront);
  }));

  // AI Assistant route for chat responses
  app.post("/api/ai-assistant", asyncHandler(async (req: Request, res: Response) => {
    const messageSchema = z.object({
      message: z.string()
    });
    
    try {
      const { message } = messageSchema.parse(req.body);
      
      // In a real app, this would use OpenAI or another API to generate a response
      // For now, return a simple response
      const response = `Thank you for your question: "${message}". As an AI assistant, I'd be happy to help with business advice, but I'm currently in development mode.`;
      
      res.json({ response });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      throw error;
    }
  }));

  // API for dashboard recommendations
  app.get("/api/recommendations", asyncHandler(async (req: Request, res: Response) => {
    const suppliers = await storage.getRecommendedSuppliers();
    const procurements = await storage.getRecommendedProcurements();
    const financialOffers = await storage.getRecommendedFinancialOffers();
    
    const recommendations = {
      suppliers: suppliers.slice(0, 3),
      procurements: procurements.slice(0, 3),
      financialOffers: financialOffers.slice(0, 3)
    };
    
    res.json(recommendations);
  }));

  const httpServer = createServer(app);
  return httpServer;
}
