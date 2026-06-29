'use client';
import { Typography, Paper, Box } from '@mui/material';
import { DynamicForm } from '@/components/DynamicForm/DynamicForm';
import formConfig from '@/config/form-config.json';
import { FieldConfig } from '@/types/form';

const fields = formConfig.data as FieldConfig[];

export default function SignupPage() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      <Paper sx={{ p: 4 }}>
        <DynamicForm
          formId="signup"
          fields={fields}
          onSubmit={data => console.log('Signup submitted:', data)}
        />
      </Paper>
    </Box>
  );
}
