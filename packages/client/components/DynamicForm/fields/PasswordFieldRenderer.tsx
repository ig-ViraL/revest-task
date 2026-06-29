'use client';
import { memo, useMemo, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FieldConfig } from '@/types/form';

export const PasswordFieldRenderer = memo(function PasswordFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const [show, setShow] = useState(false);
  const rules = useMemo(() => ({
    required:  field.required ? `${field.name} is required` : false,
    minLength: field.minLength ? { value: field.minLength, message: `Min ${field.minLength} characters` } : undefined,
  }), [field.required, field.name, field.minLength]);

  return (
    <Controller name={String(field.id)} control={control} rules={rules}
      render={({ field: f, fieldState }) => (
        <TextField {...f} type={show ? 'text' : 'password'} label={field.name} fullWidth required={field.required}
          error={!!fieldState.error} helperText={fieldState.error?.message}
          InputProps={{ endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShow(s => !s)} edge="end">
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )}}
        />
      )}
    />
  );
});
