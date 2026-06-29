import { memo } from 'react';
import {
  Card, CardContent, CardMedia, CardActions,
  Typography, Chip, Button, Box, IconButton,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '@/contexts/CartContext';

interface Props { product: any }

export const ShopProductCard = memo(function ShopProductCard({ product }: Props) {
  const { addItem, removeItem, updateQty, items } = useCart();
  const cartItem = items.find(i => i.productId === product.id);
  const qty = cartItem?.quantity ?? 0;
  const outOfStock = product.stock <= 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
      <CardMedia
        component="img"
        height="180"
        image={product.imageUrl || `https://placehold.co/400x180/e8f4fd/1976d2?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
        sx={{ objectFit: product.imageUrl?.startsWith('data:') ? 'contain' : 'cover', bgcolor: '#f5f5f5' }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap title={product.name}>
          {product.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          SKU: {product.sku}
        </Typography>
        {product.category && (
          <Chip label={product.category} size="small" variant="outlined" sx={{ mb: 1 }} />
        )}
        {product.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="h6" color="primary.main" fontWeight={700}>
            ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Typography>
          <Typography variant="caption" color={outOfStock ? 'error.main' : 'success.main'} fontWeight={500}>
            {outOfStock ? 'Out of stock' : `${product.stock} left`}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
        {qty === 0 ? (
          <Button
            fullWidth
            variant="contained"
            size="small"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => addItem({ productId: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl, category: product.category })}
            disabled={outOfStock}
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', border: '1px solid', borderColor: 'primary.main', borderRadius: 1, overflow: 'hidden' }}>
            <IconButton
              size="small"
              onClick={() => updateQty(product.id, qty - 1)}
              sx={{ borderRadius: 0, color: 'primary.main', px: 1.5 }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ minWidth: 32, textAlign: 'center' }}>
              {qty}
            </Typography>
            <IconButton
              size="small"
              onClick={() => updateQty(product.id, qty + 1)}
              sx={{ borderRadius: 0, color: 'primary.main', px: 1.5 }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
});
