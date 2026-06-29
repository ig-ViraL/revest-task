import { memo } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, IconButton, Box, CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  product: any;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = memo(function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={product.imageUrl || `https://via.placeholder.com/300x140?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>{product.name}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>{product.sku}</Typography>
        {product.category && <Chip label={product.category} size="small" sx={{ mb: 1 }} />}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="h6" color="primary">${Number(product.price).toFixed(2)}</Typography>
          <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
            Stock: {product.stock}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <IconButton size="small" onClick={() => onEdit(product)}><EditIcon /></IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(product.id)}><DeleteIcon /></IconButton>
      </CardActions>
    </Card>
  );
});
