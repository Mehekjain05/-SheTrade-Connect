import {
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  suppliers, type Supplier, type InsertSupplier,
  procurements, type Procurement, type InsertProcurement,
  financialOffers, type FinancialOffer, type InsertFinancialOffer,
  forumPosts, type ForumPost, type InsertForumPost,
  learningResources, type LearningResource, type InsertLearningResource,
  metrics, type Metric, type InsertMetric,
  storefronts, type Storefront, type InsertStorefront
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(userId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Supplier methods
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  getRecommendedSuppliers(): Promise<Supplier[]>;
  
  // Procurement methods
  getProcurements(): Promise<Procurement[]>;
  getProcurement(id: number): Promise<Procurement | undefined>;
  getRecommendedProcurements(): Promise<Procurement[]>;
  
  // Financial offer methods
  getFinancialOffers(): Promise<FinancialOffer[]>;
  getRecommendedFinancialOffers(): Promise<FinancialOffer[]>;
  
  // Forum post methods
  getForumPosts(): Promise<ForumPost[]>;
  getForumPost(id: number): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  
  // Learning resource methods
  getLearningResources(): Promise<LearningResource[]>;
  getRecommendedLearningResources(): Promise<LearningResource[]>;
  
  // Metrics methods
  getMetrics(userId: number): Promise<Metric | undefined>;
  updateMetrics(userId: number, metrics: Partial<InsertMetric>): Promise<Metric>;
  
  // Storefront methods
  getStorefront(userId: number): Promise<Storefront | undefined>;
  updateStorefront(userId: number, storefront: Partial<InsertStorefront>): Promise<Storefront>;
  getStorefrontProgress(userId: number): Promise<number>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private suppliers: Map<number, Supplier>;
  private procurements: Map<number, Procurement>;
  private financialOffers: Map<number, FinancialOffer>;
  private forumPosts: Map<number, ForumPost>;
  private learningResources: Map<number, LearningResource>;
  private metricsData: Map<number, Metric>;
  private storefronts: Map<number, Storefront>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private supplierIdCounter: number;
  private procurementIdCounter: number;
  private financialOfferIdCounter: number;
  private forumPostIdCounter: number;
  private learningResourceIdCounter: number;
  private metricsIdCounter: number;
  private storefrontIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.suppliers = new Map();
    this.procurements = new Map();
    this.financialOffers = new Map();
    this.forumPosts = new Map();
    this.learningResources = new Map();
    this.metricsData = new Map();
    this.storefronts = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.supplierIdCounter = 1;
    this.procurementIdCounter = 1;
    this.financialOfferIdCounter = 1;
    this.forumPostIdCounter = 1;
    this.learningResourceIdCounter = 1;
    this.metricsIdCounter = 1;
    this.storefrontIdCounter = 1;
    
    // Initialize sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(userId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.userId === userId,
    );
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const product: Product = { ...insertProduct, id, createdAt: now };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    const updatedProduct: Product = { ...existingProduct, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Supplier methods
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async getRecommendedSuppliers(): Promise<Supplier[]> {
    // In a real app, this would use AI to find relevant suppliers
    // For now, return all suppliers
    return Array.from(this.suppliers.values());
  }

  // Procurement methods
  async getProcurements(): Promise<Procurement[]> {
    return Array.from(this.procurements.values());
  }

  async getProcurement(id: number): Promise<Procurement | undefined> {
    return this.procurements.get(id);
  }

  async getRecommendedProcurements(): Promise<Procurement[]> {
    // In a real app, this would use AI to find relevant procurement opportunities
    // For now, return all procurements
    return Array.from(this.procurements.values());
  }

  // Financial offer methods
  async getFinancialOffers(): Promise<FinancialOffer[]> {
    return Array.from(this.financialOffers.values());
  }

  async getRecommendedFinancialOffers(): Promise<FinancialOffer[]> {
    // In a real app, this would use AI to find relevant financial offers
    // For now, return all offers
    return Array.from(this.financialOffers.values());
  }

  // Forum post methods
  async getForumPosts(): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values());
  }

  async getForumPost(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const id = this.forumPostIdCounter++;
    const now = new Date();
    const post: ForumPost = { ...insertPost, id, responseCount: 0, createdAt: now };
    this.forumPosts.set(id, post);
    return post;
  }

  // Learning resource methods
  async getLearningResources(): Promise<LearningResource[]> {
    return Array.from(this.learningResources.values());
  }

  async getRecommendedLearningResources(): Promise<LearningResource[]> {
    // In a real app, this would use AI to find relevant learning resources
    // For now, return all resources
    return Array.from(this.learningResources.values());
  }

  // Metrics methods
  async getMetrics(userId: number): Promise<Metric | undefined> {
    const userMetrics = Array.from(this.metricsData.values()).find(
      (metric) => metric.userId === userId
    );
    return userMetrics;
  }

  async updateMetrics(userId: number, metricsUpdate: Partial<InsertMetric>): Promise<Metric> {
    const existingMetrics = Array.from(this.metricsData.values()).find(
      (metric) => metric.userId === userId
    );
    
    if (!existingMetrics) {
      const id = this.metricsIdCounter++;
      const now = new Date();
      const newMetrics: Metric = {
        id,
        userId,
        storeVisits: metricsUpdate.storeVisits || 0,
        orders: metricsUpdate.orders || 0,
        connections: metricsUpdate.connections || 0,
        revenue: metricsUpdate.revenue || 0,
        lastUpdated: now
      };
      this.metricsData.set(id, newMetrics);
      return newMetrics;
    }
    
    const updatedMetrics: Metric = {
      ...existingMetrics,
      ...metricsUpdate,
      lastUpdated: new Date()
    };
    this.metricsData.set(existingMetrics.id, updatedMetrics);
    return updatedMetrics;
  }

  // Storefront methods
  async getStorefront(userId: number): Promise<Storefront | undefined> {
    return Array.from(this.storefronts.values()).find(
      (storefront) => storefront.userId === userId
    );
  }

  async updateStorefront(userId: number, storefrontUpdate: Partial<InsertStorefront>): Promise<Storefront> {
    const existingStorefront = Array.from(this.storefronts.values()).find(
      (storefront) => storefront.userId === userId
    );
    
    if (!existingStorefront) {
      const id = this.storefrontIdCounter++;
      const now = new Date();
      // Ensure setupSteps is provided or create default
      const setupSteps = storefrontUpdate.setupSteps || {
        basicInfo: true,
        products: false,
        logo: false,
        payment: false,
        shipping: false
      };
      
      const newStorefront: Storefront = {
        id,
        userId,
        completionPercentage: storefrontUpdate.completionPercentage || 0,
        setupSteps,
        createdAt: now
      };
      this.storefronts.set(id, newStorefront);
      return newStorefront;
    }
    
    const updatedStorefront: Storefront = {
      ...existingStorefront,
      ...storefrontUpdate
    };
    this.storefronts.set(existingStorefront.id, updatedStorefront);
    return updatedStorefront;
  }

  async getStorefrontProgress(userId: number): Promise<number> {
    const storefront = await this.getStorefront(userId);
    return storefront?.completionPercentage || 0;
  }

  // Initialize sample data for demonstration
  private initializeSampleData() {
    // Create sample user
    const sophiaUser: InsertUser = {
      username: "sophia_patel",
      password: "password123", // In a real app, this would be hashed
      name: "Sophia Patel",
      businessName: "Eco Textiles Ltd",
      email: "sophia@ecotextiles.com",
      phone: "+91 9876543210"
    };
    this.createUser(sophiaUser).then(user => {
      // Create sample products for this user
      const products: InsertProduct[] = [
        {
          userId: user.id,
          name: "Organic Cotton Fabric",
          description: "High-quality organic cotton fabric, sustainably sourced",
          price: 45000, // ₹450 per meter
          image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=240&q=80"
        },
        {
          userId: user.id,
          name: "Recycled Polyester Blend",
          description: "Eco-friendly recycled polyester blend for sustainable fashion",
          price: 38000, // ₹380 per meter
          image: "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=240&q=80"
        },
        {
          userId: user.id,
          name: "Hemp Textile",
          description: "Natural hemp textile with excellent durability",
          price: 52000, // ₹520 per meter
          image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=240&q=80"
        }
      ];
      
      products.forEach(product => this.createProduct(product));
      
      // Create metrics for this user
      const userMetrics: InsertMetric = {
        userId: user.id,
        storeVisits: 2415,
        orders: 48,
        connections: 12,
        revenue: 4258600 // ₹42,586
      };
      this.updateMetrics(user.id, userMetrics);
      
      // Create storefront for this user
      const userStorefront: InsertStorefront = {
        userId: user.id,
        completionPercentage: 75,
        setupSteps: {
          basicInfo: true,
          products: true,
          logo: true,
          payment: false,
          shipping: false
        }
      };
      this.updateStorefront(user.id, userStorefront);
    });
    
    // Create sample suppliers
    const suppliers: InsertSupplier[] = [
      {
        name: "EcoFibers Inc.",
        category: "Raw Materials",
        description: "Sustainable textile raw materials supplier",
        costSavings: 20
      },
      {
        name: "GreenPackaging Co.",
        category: "Packaging",
        description: "Eco-friendly packaging solutions",
        costSavings: 15
      },
      {
        name: "EthicalSource Logistics",
        category: "Logistics",
        description: "Ethical and sustainable logistics services",
        costSavings: 10
      }
    ];
    
    suppliers.forEach(supplier => {
      const id = this.supplierIdCounter++;
      const now = new Date();
      this.suppliers.set(id, { ...supplier, id, createdAt: now });
    });
    
    // Create sample procurement opportunities
    const procurements: InsertProcurement[] = [
      {
        title: "Sustainable Textiles for Government Uniforms",
        organization: "Ministry of Textiles",
        description: "Seeking suppliers of sustainable textiles for government uniform program",
        category: "Government",
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      },
      {
        title: "Eco-Friendly Packaging Materials",
        organization: "FashionRetail Inc.",
        description: "Looking for eco-friendly packaging for clothing line",
        category: "Corporate",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    ];
    
    procurements.forEach(procurement => {
      const id = this.procurementIdCounter++;
      const now = new Date();
      this.procurements.set(id, { ...procurement, id, createdAt: now });
    });
    
    // Create sample financial offers
    const financialOffers: InsertFinancialOffer[] = [
      {
        type: "loan",
        amount: 50000000, // ₹5,00,000
        interestRate: 850, // 8.5%
        termMonths: 24
      },
      {
        type: "invoice_financing",
        amount: 35000000, // ₹3,50,000
        interestRate: 800, // 8%
        termMonths: 6
      },
      {
        type: "equipment_loan",
        amount: 75000000, // ₹7,50,000
        interestRate: 900, // 9%
        termMonths: 36
      }
    ];
    
    financialOffers.forEach(offer => {
      const id = this.financialOfferIdCounter++;
      const now = new Date();
      this.financialOffers.set(id, { ...offer, id, createdAt: now });
    });
    
    // Create sample forum posts
    const forumPosts: InsertForumPost[] = [
      {
        userId: 1, // Assuming user 1 exists
        title: "Tips for EU Export Compliance",
        content: "I'm looking to export my textiles to the EU. What regulations should I be aware of?",
        tags: ["Export", "Regulations"]
      },
      {
        userId: 1, // Assuming user 1 exists
        title: "How I secured my first corporate contract",
        content: "Sharing my experience securing a contract with a large corporation as a small business...",
        tags: ["Success Story", "Procurement"]
      },
      {
        userId: 1, // Assuming user 1 exists
        title: "Digital marketing on a small budget",
        content: "What are your strategies for effective digital marketing with limited resources?",
        tags: ["Marketing", "Digital"]
      }
    ];
    
    forumPosts.forEach(post => {
      const id = this.forumPostIdCounter++;
      const now = new Date();
      this.forumPosts.set(id, { ...post, id, responseCount: Math.floor(Math.random() * 20) + 1, createdAt: now });
    });
    
    // Create sample learning resources
    const learningResources: InsertLearningResource[] = [
      {
        title: "Supply Chain Management for Small Businesses",
        type: "video",
        description: "Learn the basics of supply chain management tailored for small businesses",
        duration: 15,
        level: "beginner"
      },
      {
        title: "Guide to Digital Marketing for Product Visibility",
        type: "article",
        description: "Practical strategies to increase your product visibility online",
        duration: 10,
        level: "intermediate"
      },
      {
        title: "How to Navigate International Trade Regulations",
        type: "guide",
        description: "Comprehensive guide to international trade regulations for small businesses",
        duration: 25,
        level: "advanced"
      }
    ];
    
    learningResources.forEach(resource => {
      const id = this.learningResourceIdCounter++;
      const now = new Date();
      this.learningResources.set(id, { ...resource, id, createdAt: now });
    });
  }
}

export const storage = new MemStorage();
