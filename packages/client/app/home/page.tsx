'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Grid, Typography, Box, CircularProgress, TextField,
  InputAdornment, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ShopProductCard } from '@/components/products/ShopProductCard';
import { CartBar } from '@/components/CartBar';
import { api } from '@/lib/api';

export default function HomePage() {
  const currentUser = useRequireAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameSearch, setNameSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    api.products.list()
      .then(data => setProducts(data.filter((p: any) => p.isActive !== false)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p: any) => p.category).filter(Boolean))) as string[],
    [products]
  );

  const filtered = useMemo(() => {
    let result = products;

    if (nameSearch.trim()) {
      try {
        const rx = new RegExp(nameSearch.trim(), 'i');
        result = result.filter(p => rx.test(p.name) || rx.test(p.description ?? ''));
      } catch {
        result = result.filter(p => p.name.toLowerCase().includes(nameSearch.toLowerCase()));
      }
    }

    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) result = result.filter(p => Number(p.price) >= min);
    if (!isNaN(max)) result = result.filter(p => Number(p.price) <= max);

    return result;
  }, [products, nameSearch, selectedCategory, minPrice, maxPrice]);

  const handleMinPrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) setMinPrice(v);
  }, []);

  const handleMaxPrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) setMaxPrice(v);
  }, []);

  if (!currentUser) return null; // loading or redirecting

  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Shop</Typography>

      {/* Filter bar: search left, controls right — single row */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        {/* Search — left, limited width */}
        <TextField
          placeholder="Search by name (supports regex)…"
          value={nameSearch}
          onChange={e => setNameSearch(e.target.value)}
          size="small"
          sx={{ width: 300, flexShrink: 0 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
        />

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Category dropdown */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price range: min + max inputs */}
        <TextField
          label="Min Price"
          value={minPrice}
          onChange={handleMinPrice}
          size="small"
          sx={{ width: 110 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
          inputProps={{ inputMode: 'decimal' }}
        />
        <TextField
          label="Max Price"
          value={maxPrice}
          onChange={handleMaxPrice}
          size="small"
          sx={{ width: 110 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography color="text.secondary">No products match your filters.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map(p => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <ShopProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      )}
      <CartBar />
    </Box>
  );
}
