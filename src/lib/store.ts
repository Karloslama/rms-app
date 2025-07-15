"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, CartItem, Transaction, Category } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, quantity: number) => void;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getTax: () => number;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coffee - Americano',
    description: 'Rich and bold coffee',
    price: 4.50,
    cost: 1.50,
    sku: 'COF-001',
    barcode: '1234567890123',
    category: 'Beverages',
    stock: 50,
    minStock: 10,
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Croissant',
    description: 'Fresh baked croissant',
    price: 3.25,
    cost: 1.00,
    sku: 'BKR-001',
    category: 'Bakery',
    stock: 25,
    minStock: 5,
    imageUrl: 'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Sandwich - Club',
    description: 'Triple decker club sandwich',
    price: 8.99,
    cost: 3.50,
    sku: 'SND-001',
    category: 'Food',
    stock: 15,
    minStock: 3,
    imageUrl: 'https://images.pexels.com/photos/1199960/pexels-photo-1199960.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Beverages', description: 'Hot and cold drinks', color: '#3B82F6', isActive: true },
  { id: '2', name: 'Food', description: 'Main dishes and snacks', color: '#10B981', isActive: true },
  { id: '3', name: 'Bakery', description: 'Fresh baked goods', color: '#F59E0B', isActive: true },
  { id: '4', name: 'Retail', description: 'Retail merchandise', color: '#8B5CF6', isActive: true },
];

// Zustand stores
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication
        if (email === 'admin@pos.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            email: 'admin@pos.com',
            name: 'John Admin',
            role: 'admin',
            createdAt: new Date(),
            lastLogin: new Date(),
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        if (email === 'cashier@pos.com' && password === 'cashier123') {
          const user: User = {
            id: '2',
            email: 'cashier@pos.com',
            name: 'Jane Cashier',
            role: 'cashier',
            createdAt: new Date(),
            lastLogin: new Date(),
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      categories: mockCategories,
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates, updatedAt: new Date() } : product
          ),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },
      updateStock: (id, quantity) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, stock: product.stock - quantity } : product
          ),
        }));
      },
      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({ categories }),
    }),
    {
      name: 'product-storage',
    }
  )
);

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    const { items } = get();
    const existingItem = items.find((item) => item.product.id === product.id);
    
    if (existingItem) {
      set({
        items: items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({ items: [...items, { product, quantity }] });
    }
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
  getTax: () => {
    const subtotal = get().getSubtotal();
    return subtotal * 0.08; // 8% tax rate
  },
  getTotal: () => {
    const subtotal = get().getSubtotal();
    const tax = get().getTax();
    return subtotal + tax;
  },
}));

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({ transactions: [newTransaction, ...state.transactions] }));
      },
      setTransactions: (transactions) => set({ transactions }),
    }),
    {
      name: 'transaction-storage',
    }
  )
);