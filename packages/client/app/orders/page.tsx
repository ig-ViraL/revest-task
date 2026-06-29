'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { OrderCard } from '@/components/orders/OrderCard';
import { CreateOrderForm } from '@/components/orders/CreateOrderForm';
import { api } from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders]     = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [o, p] = await Promise.all([api.orders.list(), api.products.list()]);
      setOrders(o);
      setProducts(p);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = useCallback(async (data: any) => {
    try { await api.orders.create(data); await load(); }
    catch (e: any) { setError(e.message); }
  }, [load]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Orders</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          New Order
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {orders.length === 0
        ? <Typography color="text.secondary">No orders yet. Create your first order above.</Typography>
        : orders.map(o => <OrderCard key={o.id} order={o} />)
      }
      <CreateOrderForm open={formOpen} products={products}
        onClose={() => setFormOpen(false)} onSave={handleCreate} />
    </>
  );
}
