import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Stored in smallest currency unit (paise)
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

// Supplier model
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  costSavings: integer("cost_savings"), // Percentage
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

// Procurement opportunity model
export const procurements = pgTable("procurements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProcurementSchema = createInsertSchema(procurements).omit({
  id: true,
  createdAt: true,
});

// Financial opportunity model
export const financialOffers = pgTable("financial_offers", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "loan", "invoice_financing", "equipment_loan"
  amount: integer("amount").notNull(), // In smallest currency unit (paise)
  interestRate: integer("interest_rate").notNull(), // In basis points (e.g., 850 = 8.5%)
  termMonths: integer("term_months").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFinancialOfferSchema = createInsertSchema(financialOffers).omit({
  id: true,
  createdAt: true,
});

// Discussion forum model
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  responseCount: integer("response_count").default(0),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  responseCount: true,
  createdAt: true,
});

// Learning resources model
export const learningResources = pgTable("learning_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // "video", "article", "guide"
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // In minutes
  level: text("level").notNull(), // "beginner", "intermediate", "advanced"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLearningResourceSchema = createInsertSchema(learningResources).omit({
  id: true,
  createdAt: true,
});

// Dashboard metrics model
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  storeVisits: integer("store_visits").default(0),
  orders: integer("orders").default(0),
  connections: integer("connections").default(0),
  revenue: integer("revenue").default(0), // In smallest currency unit (paise)
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertMetricsSchema = createInsertSchema(metrics).omit({
  id: true,
  lastUpdated: true,
});

// Storefront model
export const storefronts = pgTable("storefronts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  completionPercentage: integer("completion_percentage").default(0),
  setupSteps: json("setup_steps").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStorefrontSchema = createInsertSchema(storefronts).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Procurement = typeof procurements.$inferSelect;
export type InsertProcurement = z.infer<typeof insertProcurementSchema>;

export type FinancialOffer = typeof financialOffers.$inferSelect;
export type InsertFinancialOffer = z.infer<typeof insertFinancialOfferSchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type LearningResource = typeof learningResources.$inferSelect;
export type InsertLearningResource = z.infer<typeof insertLearningResourceSchema>;

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricsSchema>;

export type Storefront = typeof storefronts.$inferSelect;
export type InsertStorefront = z.infer<typeof insertStorefrontSchema>;
