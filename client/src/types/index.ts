// User types
export interface User {
  id: number;
  username: string;
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  createdAt: Date;
}

// Product types
export interface Product {
  id: number;
  userId: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  createdAt: Date;
}

// Supplier types
export interface Supplier {
  id: number;
  name: string;
  category: string;
  description?: string;
  costSavings?: number;
  createdAt: Date;
}

// Procurement types
export interface Procurement {
  id: number;
  title: string;
  organization: string;
  description: string;
  category: string;
  dueDate: Date;
  createdAt: Date;
}

// Financial Offer types
export interface FinancialOffer {
  id: number;
  type: "loan" | "invoice_financing" | "equipment_loan";
  amount: number;
  interestRate: number;
  termMonths: number;
  createdAt: Date;
}

// Forum Post types
export interface ForumPost {
  id: number;
  userId: number;
  title: string;
  content: string;
  responseCount: number;
  tags: string[];
  createdAt: Date;
}

// Learning Resource types
export interface LearningResource {
  id: number;
  title: string;
  type: "video" | "article" | "guide";
  description: string;
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
}

// Metrics types
export interface Metrics {
  id: number;
  userId: number;
  storeVisits: number;
  orders: number;
  connections: number;
  revenue: number;
  lastUpdated: Date;
}

// Storefront types
export interface StorefrontSetupSteps {
  basicInfo: boolean;
  products: boolean;
  logo: boolean;
  payment: boolean;
  shipping: boolean;
}

export interface Storefront {
  id: number;
  userId: number;
  completionPercentage: number;
  setupSteps: StorefrontSetupSteps;
  createdAt: Date;
}

// AI Recommendation types
export interface Recommendation {
  suppliers: Supplier[];
  procurements: Procurement[];
  financialOffers: FinancialOffer[];
}

// Navigation item type
export interface NavItem {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
}
