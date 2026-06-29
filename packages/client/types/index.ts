export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  loveReact?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  userEmail?: string;
  address?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
