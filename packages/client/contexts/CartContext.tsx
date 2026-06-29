'use client';
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartState | null>(null);

const CART_KEY = 'revest_cart';

function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'); } catch { return []; }
}
function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => { setItems(loadCart()); }, []);

  const setAndSave = useCallback((next: CartItem[]) => {
    saveCart(next);
    setItems(next);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setAndSave(
      (prev => {
        const existing = prev.find(i => i.productId === item.productId);
        if (existing) return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
        return [...prev, { ...item, quantity: 1 }];
      })(loadCart())
    );
  }, [setAndSave]);

  const removeItem = useCallback((productId: string) => {
    setAndSave(loadCart().filter(i => i.productId !== productId));
  }, [setAndSave]);

  const updateQty = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) { removeItem(productId); return; }
    setAndSave(loadCart().map(i => i.productId === productId ? { ...i, quantity } : i));
  }, [setAndSave, removeItem]);

  const clearCart = useCallback(() => { setAndSave([]); }, [setAndSave]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
