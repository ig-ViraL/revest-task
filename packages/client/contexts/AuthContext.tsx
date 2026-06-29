'use client';
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types';

interface AuthState {
  currentUser: User | null | undefined; // undefined = still loading from localStorage
  login: (email: string, name: string, extra?: Record<string, unknown>) => 'registered' | 'logged_in';
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone'>>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem('revest_users') ?? '[]'); } catch { return []; }
}
function saveUsers(users: User[]) {
  localStorage.setItem('revest_users', JSON.stringify(users));
}
function getCurrentUser(): User | null {
  try { return JSON.parse(localStorage.getItem('revest_current_user') ?? 'null'); } catch { return null; }
}
function saveCurrentUser(user: User | null) {
  localStorage.setItem('revest_current_user', JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // undefined = hydrating, null = not logged in, User = logged in
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    setCurrentUser(getCurrentUser()); // sets to User or null after first render
  }, []);

  const login = useCallback((email: string, name: string, extra?: Record<string, unknown>): 'registered' | 'logged_in' => {
    const users = getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      saveCurrentUser(existing);
      setCurrentUser(existing);
      return 'logged_in';
    }
    const newUser: User = {
      id: uuidv4(),
      name: name || email.split('@')[0],
      email,
      password: '',
      createdAt: new Date().toISOString(),
      ...(extra ?? {}),
    } as User;
    saveUsers([...users, newUser]);
    saveCurrentUser(newUser);
    setCurrentUser(newUser);
    return 'registered';
  }, []);

  const logout = useCallback(() => {
    saveCurrentUser(null);
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'phone'>>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    const users = getUsers().map(u => u.id === updated.id ? updated : u);
    saveUsers(users);
    saveCurrentUser(updated);
    setCurrentUser(updated);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
