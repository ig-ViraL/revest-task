import { memo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, Tabs, Tab, Box,
  Typography, Avatar, IconButton, Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  product?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const ProductForm = memo(function ProductForm({ open, product, onClose, onSave }: Props) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({ defaultValues: product ?? {} });
  const [imgTab, setImgTab] = useState(0);
  const [preview, setPreview] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);
  const imageUrl = watch('imageUrl');

  useEffect(() => {
    reset(product ?? {});
    setPreview(product?.imageUrl ?? '');
    setImgTab(product?.imageUrl?.startsWith('data:') ? 0 : 1);
  }, [open, product, reset]);

  useEffect(() => {
    if (imgTab === 1) setPreview(imageUrl ?? '');
  }, [imageUrl, imgTab]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2 MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target?.result as string;
      setValue('imageUrl', b64, { shouldValidate: true });
      setPreview(b64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>{product ? 'Edit Product' : 'New Product'}</Typography>
          {product && <Typography variant="caption" color="text.secondary">SKU: {product.sku}</Typography>}
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Stack spacing={2}>

            {/* Row: Name + SKU */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Product Name"
                required
                fullWidth
                size="small"
                sx={{ flex: 2 }}
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={(errors.name?.message as string) ?? ' '}
              />
              <TextField
                label="SKU"
                required
                size="small"
                sx={{ flex: 1 }}
                {...register('sku', { required: 'SKU is required' })}
                error={!!errors.sku}
                helperText={(errors.sku?.message as string) ?? ' '}
              />
            </Box>

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              size="small"
              helperText=" "
              {...register('description')}
            />

            {/* Row: Price + Stock */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Price"
                type="number"
                required
                size="small"
                fullWidth
                inputProps={{ step: '0.01', min: 0 }}
                {...register('price', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Must be positive' } })}
                error={!!errors.price}
                helperText={(errors.price?.message as string) ?? ' '}
              />
              <TextField
                label="Stock"
                type="number"
                required
                size="small"
                fullWidth
                inputProps={{ min: 0 }}
                {...register('stock', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Must be ≥ 0' } })}
                error={!!errors.stock}
                helperText={(errors.stock?.message as string) ?? ' '}
              />
            </Box>

            {/* Category */}
            <TextField
              label="Category"
              fullWidth
              size="small"
              placeholder="e.g. Electronics, Groceries"
              helperText=" "
              {...register('category')}
            />

            {/* Image Section — single contained box, no internal Divider */}
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ px: 2, pt: 1.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={0.5}>
                  PRODUCT IMAGE
                </Typography>
              </Box>
              <Tabs
                value={imgTab}
                onChange={(_, v) => setImgTab(v)}
                sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}
                TabIndicatorProps={{ sx: { height: 2 } }}
              >
                <Tab
                  icon={<UploadFileIcon fontSize="small" />}
                  iconPosition="start"
                  label="Upload"
                  sx={{ minHeight: 44, py: 0, fontSize: 13 }}
                />
                <Tab
                  icon={<LinkIcon fontSize="small" />}
                  iconPosition="start"
                  label="URL"
                  sx={{ minHeight: 44, py: 0, fontSize: 13 }}
                />
              </Tabs>

              {/* Tab content stays inside the same bordered box */}
              <Box sx={{ p: 2 }}>
                {imgTab === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      variant="rounded"
                      src={preview}
                      sx={{ width: 72, height: 72, bgcolor: 'grey.100', fontSize: 11, color: 'text.secondary', flexShrink: 0 }}
                    >
                      No img
                    </Avatar>
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileRef}
                        onChange={handleFile}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<UploadFileIcon />}
                        onClick={() => fileRef.current?.click()}
                      >
                        Choose File
                      </Button>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        JPG, PNG, WEBP · Max 2 MB
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Stack spacing={1.5}>
                    <TextField
                      label="Image URL"
                      fullWidth
                      size="small"
                      placeholder="https://example.com/image.jpg"
                      {...register('imageUrl')}
                      onChange={e => { register('imageUrl').onChange(e); setPreview(e.target.value); }}
                    />
                    {preview && (
                      <Box
                        component="img"
                        src={preview}
                        alt="preview"
                        sx={{ width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 1, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}
                        onError={() => setPreview('')}
                      />
                    )}
                  </Stack>
                )}
              </Box>
            </Box>

          </Stack>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained">
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});
