'use client';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Stack, Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import { FieldConfig, FormValues } from '@/types/form';
import { DynamicField } from './DynamicField';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Props {
  formId: string;
  fields: FieldConfig[];
  onSubmit?: (data: FormValues) => void;
}

function buildDefaultValues(fields: FieldConfig[]): FormValues {
  return Object.fromEntries(
    fields.map(f => [String(f.id), f.defaultValue ?? ''])
  );
}

export const DynamicForm = memo(function DynamicForm({ formId, fields, onSubmit }: Props) {
  const storageKey = `form_${formId}`;
  const [saved, setSaved, clearSaved] = useLocalStorage<FormValues>(storageKey, {});
  const [success, setSuccess] = useState(false);

  const defaultValues = useMemo(
    () => ({ ...buildDefaultValues(fields), ...saved }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formId]
  );

  const methods = useForm<FormValues>({ defaultValues });
  const { handleSubmit, watch, reset } = methods;

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const sub = watch(values => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSaved(values as FormValues), 300);
    });
    return () => { sub.unsubscribe(); clearTimeout(debounceRef.current); };
  }, [watch, setSaved]);

  const handleFormSubmit = useCallback((data: FormValues) => {
    setSaved(data);
    setSuccess(true);
    onSubmit?.(data);
  }, [setSaved, onSubmit]);

  const handleReset = useCallback(() => {
    clearSaved();
    reset(buildDefaultValues(fields));
  }, [clearSaved, reset, fields]);

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Stack spacing={3}>
          {fields.map(field => (
            <DynamicField key={field.id} field={field} />
          ))}
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" size="large">Submit</Button>
            <Button type="button" variant="outlined" onClick={handleReset}>Reset</Button>
          </Stack>
        </Stack>
      </Box>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Form submitted and saved!</Alert>
      </Snackbar>
    </FormProvider>
  );
});
