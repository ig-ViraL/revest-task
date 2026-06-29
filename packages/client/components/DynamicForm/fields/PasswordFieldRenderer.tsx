import { memo, useMemo, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { FieldConfig } from '@/types/form';

export const PasswordFieldRenderer = memo(function PasswordFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const [show, setShow] = useState(false);
  const rules = useMemo(() => ({
    required:  field.required ? `${field.name} is required` : false,
    minLength: field.minLength ? { value: field.minLength, message: `Min ${field.minLength} characters` } : undefined,
    maxLength: field.maxLength ? { value: field.maxLength, message: `Max ${field.maxLength} characters` } : undefined,
  }), [field.required, field.name, field.minLength, field.maxLength]);

  return (
    <Controller name={String(field.id)} control={control} rules={rules}
      render={({ field: f, fieldState }) => (
        <TextField
          {...f}
          type={show ? 'text' : 'password'}
          label={field.name}
          fullWidth
          required={field.required}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow(v => !v)} edge="end" size="small">
                  {show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
});
