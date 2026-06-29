'use client';
import { useState } from 'react';
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
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { toast } from 'react-toastify';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useAddresses } from '@/hooks/useAddresses';
import { DynamicForm } from '@/components/DynamicForm/DynamicForm';
import { Address } from '@/types';
import { FieldConfig, FormValues } from '@/types/form';
import editProfileConfig from '@/config/edit-profile-form.json';

const fields = editProfileConfig.data as FieldConfig[];
const F = { name: '1', phone: '3', gender: '6', loveReact: '7' };

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
  const { updateProfile } = useAuth();
  const { addresses, addAddress, updateAddress, deleteAddress } = useAddresses(currentUser?.email);
  const [addrDialog, setAddrDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState(emptyAddr());

  if (!currentUser) return null;

  const initials = currentUser.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const profileInitialValues: FormValues = {
    [F.name]: currentUser.name ?? '',
    [F.phone]: currentUser.phone ?? '',
    [F.gender]: currentUser.gender ?? '',
    [F.loveReact]: currentUser.loveReact ?? '',
  };

  const handleProfileSave = (data: FormValues) => {
    const name = String(data[F.name] ?? '').trim();
    if (!name) { toast.error('Full Name is required'); return; }
    updateProfile({
      name,
      phone: String(data[F.phone] ?? '').trim() || undefined,
      gender: String(data[F.gender] ?? '') || undefined,
      loveReact: String(data[F.loveReact] ?? '') || undefined,
    });
    toast.success('Profile updated');
    setEditDialog(false);
  };

  const openAdd = () => { setEditingAddr(null); setAddrForm(emptyAddr()); setAddrDialog(true); };
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
    if (editingAddr) {
      updateAddress(editingAddr.id, addrForm);
      toast.success('Address updated');
    } else {
      addAddress(addrForm);
      toast.success('Address saved');
    }
    setAddrDialog(false);
  };

  const deleteAddr = (id: string) => {
    deleteAddress(id);
    toast.success('Address removed');
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>My Profile</Typography>

      {/* Profile display card */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 26, fontWeight: 700 }}>
                {initials}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>{currentUser.name}</Typography>
                <Chip label="Member" size="small" color="primary" variant="outlined" sx={{ mt: 0.5 }} />
              </Box>
            </Box>
            <Button startIcon={<EditIcon />} variant="outlined" size="small" onClick={() => setEditDialog(true)}>
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ mb: 1 }} />
          <InfoRow icon={<PersonIcon />}       label="Full Name"     value={currentUser.name} />
          <Divider />
          <InfoRow icon={<EmailIcon />}        label="Email"         value={currentUser.email} />
          <Divider />
          <InfoRow icon={<PhoneIcon />}        label="Phone"         value={currentUser.phone ?? ''} />
          <Divider />
          <InfoRow icon={<WcIcon />}           label="Gender"        value={currentUser.gender ?? ''} />
          <Divider />
          <InfoRow icon={<FavoriteIcon />}     label="Loves React?"  value={currentUser.loveReact ?? ''} />
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
          <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={openAdd}>Add Address</Button>
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
                    {addr.landmark && <Typography variant="caption" color="text.secondary" display="block">{addr.landmark}</Typography>}
                    <Typography variant="body2" color="text.secondary">{addr.city}, {addr.state} – {addr.pincode}</Typography>
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

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Edit Profile</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Email cannot be changed: <strong>{currentUser.email}</strong>
          </Typography>
          <DynamicForm
            formId="profile-edit"
            fields={fields}
            initialValues={profileInitialValues}
            onSubmit={handleProfileSave}
            submitLabel="Save Changes"
            hideReset
          />
        </DialogContent>
      </Dialog>

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
