'use client';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Slide } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCart } from '@/contexts/CartContext';

export function CartBar() {
  const { count, total } = useCart();
  const router = useRouter();

  if (count === 0) return null;

  return (
    <Slide direction="up" in={count > 0}>
      <Box
        sx={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200,
          bgcolor: 'primary.main', color: 'white',
          px: 3, py: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShoppingCartIcon />
          <Box>
            <Typography variant="body2" fontWeight={700} lineHeight={1}>
              {count} item{count !== 1 ? 's' : ''} in cart
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => router.push('/cart')}
          sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700, '&:hover': { bgcolor: 'grey.100' } }}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Slide>
  );
}
