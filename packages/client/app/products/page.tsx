'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Grid, Typography, Button, Box, CircularProgress,
  TextField, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductForm } from '@/components/products/ProductForm';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function ProductsAdminPage() {
  useRequireAuth();
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [formOpen, setFormOpen]       = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch]           = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await api.products.list());
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = useCallback(async (data: Partial<Product>) => {
    try {
      if (editProduct) {
        await api.products.update(editProduct.id, data);
        toast.success('Product updated');
      } else {
        await api.products.create(data);
        toast.success('Product created');
      }
      setFormOpen(false);
      setEditProduct(null);
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    }
  }, [editProduct, load]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.products.delete(id);
      toast.success('Product deleted');
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  }, [load]);

  const filtered = search.trim()
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    : products;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Products</Typography>
          <Typography variant="body2" color="text.secondary">Admin · {products.length} total</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditProduct(null); setFormOpen(true); }}>
          Add Product
        </Button>
      </Box>

      <TextField
        placeholder="Search by name or SKU…"
        size="small"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 360 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
      />

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography color="text.secondary">No products found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map(p => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <ProductCard
                product={p}
                onEdit={product => { setEditProduct(product); setFormOpen(true); }}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProductForm
        open={formOpen}
        product={editProduct}
        onClose={() => { setFormOpen(false); setEditProduct(null); }}
        onSave={handleSave}
      />
    </>
  );
}
