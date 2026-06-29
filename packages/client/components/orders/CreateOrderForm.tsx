import { memo, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, IconButton, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props { open: boolean; products: any[]; onClose: () => void; onSave: (data: any) => void; }

export const CreateOrderForm = memo(function CreateOrderForm({ open, products, onClose, onSave }: Props) {
  const { control, register, handleSubmit, reset } = useForm({ defaultValues: { items: [{ productId: '', quantity: 1 }] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const handleClose = useCallback(() => { reset(); onClose(); }, [reset, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Order</DialogTitle>
      <form onSubmit={handleSubmit(data => { onSave(data); handleClose(); })}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {fields.map((f, i) => (
              <Box key={f.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <FormControl sx={{ flex: 2 }}>
                  <InputLabel>Product</InputLabel>
                  <Select label="Product" defaultValue="" {...register(`items.${i}.productId`, { required: true })}>
                    {products.map(p => (
                      <MenuItem key={p.id} value={p.id}>{p.name} (${Number(p.price).toFixed(2)})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField label="Qty" type="number" sx={{ flex: 1 }}
                  {...register(`items.${i}.quantity`, { valueAsNumber: true, min: 1 })}
                  inputProps={{ min: 1 }} />
                {fields.length > 1 && (
                  <IconButton color="error" onClick={() => remove(i)} sx={{ mt: 1 }}><DeleteIcon /></IconButton>
                )}
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => append({ productId: '', quantity: 1 })}>
              Add Item
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Place Order</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});
