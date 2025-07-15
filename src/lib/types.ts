export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "cashier";
  createdAt: Date;
  lastLogin?: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  sku: string;
  barcode?: string;
  category: string;
  stock: number;
  minStock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalSpent: number;
  visits: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "digital";
  status: "completed" | "refunded" | "pending";
  cashierId: string;
  customerId?: string;
  createdAt: Date;
}

export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  lowStockItems: number;
  totalProducts: number;
  weeklyTrend: number[];
  topProducts: Array<{
    product: Product;
    soldQuantity: number;
    revenue: number;
  }>;
}
