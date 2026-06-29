'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Stack,
  Avatar, Divider, Paper, IconButton, Chip, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WcIcon from '@mui/icons-material/Wc';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { toast } from 'react-toastify';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Address } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const ADDRESS_KEY = 'revest_addresses';

function loadAddresses(email: string): Address[] {
  try { const all = JSON.parse(localStorage.getItem(ADDRESS_KEY) ?? '{}'); return all[email] ?? []; } catch { return []; }
}
function saveAddresses(email: string, addresses: Address[]) {
  try {
    const all = JSON.parse(localStorage.getItem(ADDRESS_KEY) ?? '{}');
    localStorage.setItem(ADDRESS_KEY, JSON.stringify({ ...all, [email]: addresses }));
  } catch {}
}

const emptyAddr = () => ({ line1: '', line2: '', landmark: '', city: '', state: '', pincode: '' });

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
      <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block' }}>{label}</Typography>
        <Typography variant="body1" fontWeight={500}>{value || '—'}</Typography>
      </Box>
    </Box>
  );
}

export default function ProfilePage() {
  const currentUser = useRequireAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrDialog, setAddrDialog] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState(emptyAddr());

  useEffect(() => {
    if (!currentUser) return;
    setAddresses(loadAddresses(currentUser.email));
  }, [currentUser]);

  if (!currentUser) return null;

  const initials = currentUser.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const openAdd = () => {
    setEditingAddr(null);
    setAddrForm(emptyAddr());
    setAddrDialog(true);
  };

  const openEdit = (addr: Address) => {
    setEditingAddr(addr);
    setAddrForm({ line1: addr.line1, line2: addr.line2 ?? '', landmark: addr.landmark ?? '', city: addr.city, state: addr.state, pincode: addr.pincode });
    setAddrDialog(true);
  };

  const saveAddr = () => {
    const { line1, city, state, pincode } = addrForm;
    if (!line1.trim() || !city.trim() || !state.trim() || !/^\d{6}$/.test(pincode)) {
      toast.error('Fill required fields: Line 1, City, State, 6-digit Pincode');
      return;
    }
    let updated: Address[];
    if (editingAddr) {
      updated = addresses.map(a => a.id === editingAddr.id ? { ...addrForm, id: editingAddr.id } : a);
      toast.success('Address updated');
    } else {
      updated = [...addresses, { ...addrForm, id: uuidv4() }];
      toast.success('Address saved');
    }
    saveAddresses(currentUser.email, updated);
    setAddresses(updated);
    setAddrDialog(false);
  };

  const deleteAddr = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    saveAddresses(currentUser.email, updated);
    setAddresses(updated);
    toast.success('Address removed');
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>My Profile</Typography>

      {/* Profile display card */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 26, fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{currentUser.name}</Typography>
              <Chip label="Member" size="small" color="primary" variant="outlined" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <InfoRow icon={<PersonIcon />}       label="Full Name"     value={currentUser.name} />
          <Divider />
          <InfoRow icon={<EmailIcon />}        label="Email"         value={currentUser.email} />
          <Divider />
          <InfoRow icon={<WcIcon />}           label="Gender"        value={(currentUser as any).gender ?? '—'} />
          <Divider />
          <InfoRow icon={<FavoriteIcon />}     label="Loves React?"  value={(currentUser as any).loveReact ?? '—'} />
          <Divider />
          <InfoRow
            icon={<CalendarTodayIcon />}
            label="Member Since"
            value={new Date(currentUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          />
        </CardContent>
      </Card>

      {/* Addresses */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>Saved Addresses</Typography>
          <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={openAdd}>
            Add Address
          </Button>
        </Box>

        {addresses.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No saved addresses yet.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {addresses.map(addr => (
              <Card key={addr.id} variant="outlined">
                <CardContent sx={{ py: '12px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                    </Typography>
                    {addr.landmark && (
                      <Typography variant="caption" color="text.secondary" display="block">{addr.landmark}</Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {addr.city}, {addr.state} – {addr.pincode}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, ml: 1, flexShrink: 0 }}>
                    <IconButton size="small" onClick={() => openEdit(addr)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteAddr(addr.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Paper>

      {/* Add / Edit Address Dialog */}
      <Dialog open={addrDialog} onClose={() => setAddrDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>{editingAddr ? 'Edit Address' : 'New Address'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Address Line 1 *" size="small" fullWidth value={addrForm.line1}
              onChange={e => setAddrForm(p => ({ ...p, line1: e.target.value }))} />
            <TextField label="Address Line 2" size="small" fullWidth value={addrForm.line2}
              onChange={e => setAddrForm(p => ({ ...p, line2: e.target.value }))} />
            <TextField label="Landmark" size="small" fullWidth value={addrForm.landmark}
              onChange={e => setAddrForm(p => ({ ...p, landmark: e.target.value }))} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="City *" size="small" fullWidth value={addrForm.city}
                onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} />
              <TextField label="State *" size="small" fullWidth value={addrForm.state}
                onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))} />
            </Box>
            <TextField label="Pincode *" size="small" fullWidth value={addrForm.pincode}
              inputProps={{ maxLength: 6 }}
              onChange={e => setAddrForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g, '') }))} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddrDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveAddr}>{editingAddr ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
