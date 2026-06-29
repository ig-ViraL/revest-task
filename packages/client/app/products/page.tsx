'use client';
import { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductForm } from '@/components/products/ProductForm';
import { api } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [formOpen, setFormOpen]       = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await api.products.list());
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editProduct) await api.products.update(editProduct.id, data);
      else await api.products.create(data);
      setFormOpen(false);
      setEditProduct(null);
      await load();
    } catch (e: any) { setError(e.message); }
  }, [editProduct, load]);

  const handleDelete = useCallback(async (id: string) => {
    try { await api.products.delete(id); await load(); }
    catch (e: any) { setError(e.message); }
  }, [load]);

  const handleEdit = useCallback((product: any) => {
    setEditProduct(product);
    setFormOpen(true);
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditProduct(null); setFormOpen(true); }}>
          Add Product
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      <Grid container spacing={3}>
        {products.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <ProductCard product={p} onEdit={handleEdit} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
      <ProductForm open={formOpen} product={editProduct}
        onClose={() => { setFormOpen(false); setEditProduct(null); }}
        onSave={handleSave} />
    </>
  );
}
