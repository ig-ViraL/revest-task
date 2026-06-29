import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Stack } from '@mui/material';

interface Props {
  open: boolean;
  product?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const ProductForm = memo(function ProductForm({ open, product, onClose, onSave }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: product ?? {} });

  useEffect(() => { reset(product ?? {}); }, [product, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'New Product'}</DialogTitle>
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" fullWidth {...register('name', { required: 'Name is required' })}
              error={!!errors.name} helperText={errors.name?.message as string} />
            <TextField label="SKU" fullWidth {...register('sku', { required: 'SKU is required' })}
              error={!!errors.sku} helperText={errors.sku?.message as string} />
            <TextField label="Description" fullWidth multiline rows={2} {...register('description')} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Price" type="number" fullWidth
                  {...register('price', { required: 'Price required', valueAsNumber: true, min: { value: 0, message: 'Must be positive' } })}
                  error={!!errors.price} helperText={errors.price?.message as string} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Stock" type="number" fullWidth
                  {...register('stock', { required: 'Stock required', valueAsNumber: true, min: { value: 0, message: 'Must be >= 0' } })}
                  error={!!errors.stock} helperText={errors.stock?.message as string} />
              </Grid>
            </Grid>
            <TextField label="Category" fullWidth {...register('category')} />
            <TextField label="Image URL" fullWidth {...register('imageUrl')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});
