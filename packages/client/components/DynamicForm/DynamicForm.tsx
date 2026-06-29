'use client';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Stack } from '@mui/material';
import { FieldConfig, FormValues } from '@/types/form';
import { DynamicField } from './DynamicField';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Props {
  formId: string;
  fields: FieldConfig[];
  onSubmit?: (data: FormValues) => void;
  submitLabel?: string;
  hideReset?: boolean;
  initialValues?: FormValues;
}

function buildDefaultValues(fields: FieldConfig[]): FormValues {
  return Object.fromEntries(
    fields.map(f => [String(f.id), f.defaultValue ?? ''])
  );
}

export const DynamicForm = memo(function DynamicForm({
  formId, fields, onSubmit, submitLabel = 'Submit', hideReset = false, initialValues,
}: Props) {
  const storageKey = `form_${formId}`;
  const [saved, setSaved, clearSaved] = useLocalStorage<FormValues>(storageKey, {});

  const defaultValues = useMemo(
    () => ({ ...buildDefaultValues(fields), ...saved, ...initialValues }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formId]
  );

  const methods = useForm<FormValues>({ defaultValues });
  const { handleSubmit, watch, reset } = methods;

  // Re-populate when initialValues change (e.g. profile loaded from auth)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset({ ...buildDefaultValues(fields), ...initialValues });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialValues)]);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const sub = watch(values => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSaved(values as FormValues), 300);
    });
    return () => { sub.unsubscribe(); clearTimeout(debounceRef.current); };
  }, [watch, setSaved]);

  const handleFormSubmit = useCallback((data: FormValues) => {
    onSubmit?.(data);
    clearSaved();
    reset(buildDefaultValues(fields));
  }, [onSubmit, clearSaved, reset, fields]);

  const handleReset = useCallback(() => {
    clearSaved();
    reset(buildDefaultValues(fields));
  }, [clearSaved, reset, fields]);

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Stack spacing={2.5}>
          {fields.map(field => (
            <DynamicField key={field.id} field={field} />
          ))}
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" size="large" fullWidth>{submitLabel}</Button>
            {!hideReset && (
              <Button type="button" variant="outlined" onClick={handleReset}>Reset</Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </FormProvider>
  );
});
