'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar, Toolbar, Typography, IconButton, Badge,
  Avatar, Menu, MenuItem, Divider, Box, Tooltip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!currentUser || pathname === '/products') return null;

  const initials = currentUser.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    router.push('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          variant="h6"
          component={Link}
          href="/home"
          sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700, textDecoration: 'none', letterSpacing: -0.5 }}
        >
          revest.shop
        </Typography>

        <Tooltip title="Cart">
          <IconButton component={Link} href="/cart" sx={{ color: 'text.primary' }}>
            <Badge badgeContent={count} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title={currentUser.name}>
          <IconButton onClick={e => setAnchorEl(e.currentTarget)} size="small">
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{ elevation: 3, sx: { minWidth: 180, mt: 0.5 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>{currentUser.name}</Typography>
            <Typography variant="caption" color="text.secondary">{currentUser.email}</Typography>
          </Box>
          <Divider />
          <MenuItem component={Link} href="/my-orders" onClick={() => setAnchorEl(null)}>My Orders</MenuItem>
          <MenuItem component={Link} href="/profile" onClick={() => setAnchorEl(null)}>Profile Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
