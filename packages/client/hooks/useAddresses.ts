'use client';
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Address } from '@/types';

const ADDRESS_KEY = 'revest_addresses';

function load(email: string): Address[] {
  try { return JSON.parse(localStorage.getItem(ADDRESS_KEY) ?? '{}')[email] ?? []; } catch { return []; }
}
function persist(email: string, addresses: Address[]) {
  try {
    const all = JSON.parse(localStorage.getItem(ADDRESS_KEY) ?? '{}');
    localStorage.setItem(ADDRESS_KEY, JSON.stringify({ ...all, [email]: addresses }));
  } catch {}
}

export function useAddresses(email: string | undefined) {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (email) setAddresses(load(email));
  }, [email]);

  const addAddress = useCallback((fields: Omit<Address, 'id'>): Address => {
    const addr: Address = { ...fields, id: uuidv4() };
    setAddresses(prev => {
      const next = [...prev, addr];
      if (email) persist(email, next);
      return next;
    });
    return addr;
  }, [email]);

  const updateAddress = useCallback((id: string, fields: Omit<Address, 'id'>) => {
    setAddresses(prev => {
      const next = prev.map(a => a.id === id ? { ...fields, id } : a);
      if (email) persist(email, next);
      return next;
    });
  }, [email]);

  const deleteAddress = useCallback((id: string) => {
    setAddresses(prev => {
      const next = prev.filter(a => a.id !== id);
      if (email) persist(email, next);
      return next;
    });
  }, [email]);

  return { addresses, addAddress, updateAddress, deleteAddress };
}
