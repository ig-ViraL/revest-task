'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Grid, Typography, Box, CircularProgress, TextField,
  InputAdornment, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ShopProductCard } from '@/components/products/ShopProductCard';
import { CartBar } from '@/components/CartBar';
import { api } from '@/lib/api';

function HomePageContent() {
  const currentUser = useRequireAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Local state for controlled inputs — initialised from URL on mount
  const [name, setName] = useState(() => searchParams.get('name') ?? '');
  const [category, setCategory] = useState(() => searchParams.get('category') ?? '');
  const [minPrice, setMinPrice] = useState(() => searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get('maxPrice') ?? '');

  // Load categories once
  useEffect(() => {
    api.products.categories().then(setCategories).catch(console.error);
  }, []);

  // Debounce local filter state → URL (300 ms)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (name) params.set('name', name);
      if (category) params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      router.replace(`/home?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [name, category, minPrice, maxPrice, router]);

  // Fetch from backend whenever URL params change
  useEffect(() => {
    if (!currentUser) return;
    const params: Record<string, string> = {};
    const n   = searchParams.get('name');
    const c   = searchParams.get('category');
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    if (n)   params.name      = n;
    if (c)   params.category  = c;
    if (min) params.minPrice  = min;
    if (max) params.maxPrice  = max;

    setLoading(true);
    api.products.list(Object.keys(params).length ? params : undefined)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser, searchParams]);

  const handleMinPrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) setMinPrice(v);
  }, []);

  const handleMaxPrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) setMaxPrice(v);
  }, []);

  if (!currentUser) return null;

  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Shop</Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name or description"
          value={name}
          onChange={e => setName(e.target.value)}
          size="small"
          sx={{ width: 300, flexShrink: 0 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={e => setCategory(e.target.value)}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField
          label="Min Price"
          value={minPrice}
          onChange={handleMinPrice}
          size="small"
          sx={{ width: 110 }}
          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
          inputProps={{ inputMode: 'decimal' }}
        />
        <TextField
          label="Max Price"
          value={maxPrice}
          onChange={handleMaxPrice}
          size="small"
          sx={{ width: 110 }}
          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography color="text.secondary">No products match your filters.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map(p => (
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

export default function HomePage() {
  return (
    <Suspense>
      <HomePageContent />
    </Suspense>
  );
}
