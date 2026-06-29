'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Stack, Card, CardContent, Chip, Divider,
  CircularProgress, Avatar, Accordion, AccordionSummary,
  AccordionDetails, Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { api } from '@/lib/api';

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

export default function MyOrdersPage() {
  const currentUser = useRequireAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!currentUser) return;
    try {
      const all = await api.orders.list();
      const mine = all.filter((o: any) => o.userEmail === currentUser.email);
      setOrders(mine.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    loadOrders();
  }, [currentUser, loadOrders]);

  if (!currentUser) return null;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>No orders yet</Typography>
        <Button variant="contained" onClick={() => router.push('/home')}>Start Shopping</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>My Orders</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</Typography>

      <Stack spacing={2}>
        {orders.map(order => (
          <Card key={order.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                    #{order.id.split('-')[0].toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                <Chip
                  label={order.status}
                  size="small"
                  color={STATUS_COLOR[order.status] ?? 'default'}
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 'unset', '& .MuiAccordionSummary-content': { my: 0 } }}>
                  <Typography variant="body2" color="text.secondary">
                    {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''} · View details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Stack spacing={1}>
                    {order.items?.map((item: any) => (
                      <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          variant="rounded"
                          src={item.imageUrl}
                          sx={{ width: 40, height: 40, bgcolor: 'grey.100', fontSize: 12, flexShrink: 0 }}
                        >
                          {item.productName?.[0]}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>{item.productName}</Typography>
                          <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600} sx={{ flexShrink: 0 }}>
                          ₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Order Total</Typography>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                  ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
