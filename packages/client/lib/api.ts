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
    list:   ()               => request<any[]>('/api/products'),
    get:    (id: string)     => request<any>(`/api/products/${id}`),
    create: (body: unknown)  => request<any>('/api/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: unknown) => request<any>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string)     => request<null>(`/api/products/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list:         ()               => request<any[]>('/api/orders'),
    get:          (id: string)     => request<any>(`/api/orders/${id}`),
    create:       (body: unknown)  => request<any>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (id: string, status: string) => request<any>(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    cancel:       (id: string)     => request<null>(`/api/orders/${id}`, { method: 'DELETE' }),
  },
};
