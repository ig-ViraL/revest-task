import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, Chip, Box, FormHelperText } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const MultiSelectFieldRenderer = memo(function MultiSelectFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required: field.required ? `${field.name} is required` : false,
  }), [field.required, field.name]);

  return (
    <Controller name={String(field.id)} control={control} defaultValue={[]} rules={rules}
      render={({ field: f, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error} required={field.required}>
          <InputLabel>{field.name}</InputLabel>
          <Select {...f} multiple label={field.name}
            renderValue={(selected: unknown) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map(v => <Chip key={v} label={v} size="small" />)}
              </Box>
            )}>
            {(field.listOfValues1 ?? []).map(val => (
              <MenuItem key={val} value={val}>{val}</MenuItem>
            ))}
          </Select>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
});
