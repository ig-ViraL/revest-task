'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Grid, Card, CardContent, Button, IconButton,
  Stack, Divider, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Avatar, Chip, Paper, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { toast } from 'react-toastify';
import { useCart } from '@/contexts/CartContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAddresses } from '@/hooks/useAddresses';
import { api } from '@/lib/api';
import { Address } from '@/types';

const emptyAddr = (): Omit<Address, 'id'> => ({ line1: '', line2: '', landmark: '', city: '', state: '', pincode: '' });

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart();
  const currentUser = useRequireAuth();
  const router = useRouter();
  const { addresses, addAddress } = useAddresses(currentUser?.email);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [selectedAddrId, setSelectedAddrId] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newAddr, setNewAddr] = useState(emptyAddr());
  const [addrErrors, setAddrErrors] = useState<Partial<typeof newAddr>>({});

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddrId) {
      setSelectedAddrId(addresses[0].id);
      setAddingNew(false);
    } else if (addresses.length === 0) {
      setAddingNew(true);
    }
  }, [addresses, selectedAddrId]);

  if (!currentUser) return null;

  const validateAddr = () => {
    const errs: Partial<typeof newAddr> = {};
    if (!newAddr.line1.trim()) errs.line1 = 'Required';
    if (!newAddr.city.trim()) errs.city = 'Required';
    if (!newAddr.state.trim()) errs.state = 'Required';
    if (!/^\d{6}$/.test(newAddr.pincode)) errs.pincode = '6-digit pincode required';
    setAddrErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveNewAddress = () => {
    if (!validateAddr()) return;
    const addr = addAddress(newAddr);
    setSelectedAddrId(addr.id);
    setAddingNew(false);
    setNewAddr(emptyAddr());
  };

  const placeOrder = async () => {
    const address = addresses.find(a => a.id === selectedAddrId);
    if (!address && !addingNew) { toast.error('Please select a delivery address'); return; }
    if (addingNew) { toast.error('Save your address first'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setPlacing(true);
    try {
      await api.orders.create({
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        userEmail: currentUser.email,
        address,
      });
      clearCart();
      setCheckoutOpen(false);
      toast.success('Order placed successfully! 🎉');
      router.push('/my-orders');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => router.push('/home')}>Start Shopping</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Your Cart</Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {items.map(item => (
              <Card key={item.productId} variant="outlined">
                <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', py: '12px !important' }}>
                  <Avatar
                    variant="rounded"
                    src={item.imageUrl}
                    sx={{ width: 64, height: 64, bgcolor: 'grey.100' }}
                  >
                    {item.name[0]}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>{item.name}</Typography>
                    {item.category && <Chip label={item.category} size="small" variant="outlined" sx={{ mt: 0.5 }} />}
                    <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 0.5 }}>
                      ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => updateQty(item.productId, item.quantity - 1)}><RemoveIcon fontSize="small" /></IconButton>
                    <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQty(item.productId, item.quantity + 1)}><AddIcon fontSize="small" /></IconButton>
                  </Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 80, textAlign: 'right' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Typography>
                  <IconButton color="error" size="small" onClick={() => removeItem(item.productId)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Order Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Items ({count})</Typography>
                <Typography>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Delivery</Typography>
                <Typography color="success.main">FREE</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight={700}>Total</Typography>
                <Typography fontWeight={700} color="primary.main" variant="h6">
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Stack>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              onClick={() => setCheckoutOpen(true)}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Checkout / Address Dialog */}
      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delivery Address</DialogTitle>
        <DialogContent dividers>
          {addresses.length > 0 && !addingNew && (
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {addresses.map(addr => (
                <Card
                  key={addr.id}
                  variant="outlined"
                  onClick={() => setSelectedAddrId(addr.id)}
                  sx={{ cursor: 'pointer', borderColor: selectedAddrId === addr.id ? 'primary.main' : 'divider', borderWidth: selectedAddrId === addr.id ? 2 : 1 }}
                >
                  <CardContent sx={{ py: '10px !important' }}>
                    <Typography variant="body2" fontWeight={600}>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</Typography>
                    {addr.landmark && <Typography variant="caption" color="text.secondary">{addr.landmark}</Typography>}
                    <Typography variant="body2">{addr.city}, {addr.state} – {addr.pincode}</Typography>
                  </CardContent>
                </Card>
              ))}
              <Button size="small" onClick={() => setAddingNew(true)}>+ Add New Address</Button>
            </Stack>
          )}

          {(addingNew || addresses.length === 0) && (
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={600}>Enter Delivery Address</Typography>
              <TextField label="Address Line 1" required size="small" value={newAddr.line1}
                onChange={e => setNewAddr(p => ({ ...p, line1: e.target.value }))}
                error={!!addrErrors.line1} helperText={addrErrors.line1} />
              <TextField label="Address Line 2" size="small" value={newAddr.line2}
                onChange={e => setNewAddr(p => ({ ...p, line2: e.target.value }))} />
              <TextField label="Landmark" size="small" value={newAddr.landmark}
                onChange={e => setNewAddr(p => ({ ...p, landmark: e.target.value }))} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="City" required size="small" fullWidth value={newAddr.city}
                  onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))}
                  error={!!addrErrors.city} helperText={addrErrors.city} />
                <TextField label="State" required size="small" fullWidth value={newAddr.state}
                  onChange={e => setNewAddr(p => ({ ...p, state: e.target.value }))}
                  error={!!addrErrors.state} helperText={addrErrors.state} />
              </Box>
              <TextField label="Pincode" required size="small" value={newAddr.pincode}
                inputProps={{ maxLength: 6 }}
                onChange={e => setNewAddr(p => ({ ...p, pincode: e.target.value.replace(/\D/g, '') }))}
                error={!!addrErrors.pincode} helperText={addrErrors.pincode} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" onClick={saveNewAddress}>Save Address</Button>
                {addresses.length > 0 && (
                  <Button size="small" onClick={() => { setAddingNew(false); setAddrErrors({}); }}>Cancel</Button>
                )}
              </Box>
            </Stack>
          )}

          {!addingNew && selectedAddrId && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Order Summary</Typography>
                {items.map(i => (
                  <Box key={i.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{i.name} × {i.quantity}</Typography>
                    <Typography variant="body2" fontWeight={600}>₹{(i.price * i.quantity).toLocaleString('en-IN')}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontWeight={700}>Total</Typography>
                  <Typography fontWeight={700} color="primary.main">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={placeOrder}
            disabled={placing || addingNew || !selectedAddrId}
            startIcon={placing ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {placing ? 'Placing Order…' : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
