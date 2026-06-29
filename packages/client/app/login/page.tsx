'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicForm } from '@/components/DynamicForm/DynamicForm';
import { FieldConfig, FormValues } from '@/types/form';
import loginConfig from '@/config/login-form.json';

const fields = loginConfig.data as FieldConfig[];

// Field IDs from login-form.json
const F = { name: '1', email: '2', gender: '6', loveReact: '7' };

export default function LoginPage() {
  const { currentUser, login } = useAuth();
  const router = useRouter();

  // Redirect already-logged-in users away (undefined = still loading, skip)
  useEffect(() => {
    if (currentUser) router.replace('/home');
  }, [currentUser, router]);

  // Still hydrating or already redirecting
  if (currentUser !== null) return null;

  const handleSubmit = (data: FormValues) => {
    const email = String(data[F.email] ?? '').trim();
    const name  = String(data[F.name] ?? '').trim();

    if (!email) { toast.error('Email is required'); return; }
    if (!name)  { toast.error('Full Name is required'); return; }

    const result = login(email, name, {
      gender:    data[F.gender],
      loveReact: data[F.loveReact],
    });

    if (result === 'registered') {
      toast.success('Account created! Welcome to Revest 🎉');
    } else {
      toast.success('Welcome back!');
    }
    router.push('/home');
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 480, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
            Welcome to Revest
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            New here? We'll create your account. Already a member? Just sign in.
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <DynamicForm
            formId="login"
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel="Continue"
            hideReset
          />
        </CardContent>
      </Card>
    </Box>
  );
}
