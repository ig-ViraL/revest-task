import { Product, Order } from '@/types';

const BASE = '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? res.statusText);
  }
  return res.status === 204 ? (null as T) : res.json();
}

export const api = {
  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? new URLSearchParams(params).toString() : '';
      return request<Product[]>(`/api/products${qs ? `?${qs}` : ''}`);
    },
    categories: () => request<string[]>('/api/products/categories'),
    get:    (id: string)            => request<Product>(`/api/products/${id}`),
    create: (body: Partial<Product>) => request<Product>('/api/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Product>) => request<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string)            => request<null>(`/api/products/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list:   (userEmail?: string) => {
      const qs = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : '';
      return request<Order[]>(`/api/orders${qs}`);
    },
    get:          (id: string)     => request<Order>(`/api/orders/${id}`),
    create:       (body: unknown)  => request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (id: string, status: string) => request<Order>(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    cancel:       (id: string)     => request<null>(`/api/orders/${id}`, { method: 'DELETE' }),
  },
};
