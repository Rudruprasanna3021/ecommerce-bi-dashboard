import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../lib/supabase';

export interface SimpleAccount {
  username: string;
  fullName: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isDemoUser: boolean;
  currentUserAccount: SimpleAccount | null;
  signInWithUsername: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithUsername: (username: string, fullName: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signInDemo: (customName?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial default accounts
const DEFAULT_ACCOUNTS: SimpleAccount[] = [
  {
    username: 'prasanna',
    fullName: 'Prasanna (Admin)',
    passwordHash: 'admin123',
    role: 'Admin',
    createdAt: new Date().toISOString(),
  },
  {
    username: 'admin',
    fullName: 'Project Evaluator',
    passwordHash: 'admin123',
    role: 'Admin',
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentUserAccount, setCurrentUserAccount] = useState<SimpleAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(true);
  const configured = isSupabaseConfigured();

  const getStoredAccounts = (): SimpleAccount[] => {
    try {
      const stored = localStorage.getItem('shoppulse_accounts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_ACCOUNTS;
  };

  const saveAccounts = (accounts: SimpleAccount[]) => {
    localStorage.setItem('shoppulse_accounts', JSON.stringify(accounts));
  };

  useEffect(() => {
    const activeUsername = localStorage.getItem('shoppulse_active_user');
    if (activeUsername) {
      const accounts = getStoredAccounts();
      const matched = accounts.find(
        (a) => a.username.toLowerCase() === activeUsername.toLowerCase()
      );
      if (matched) {
        setCurrentUserAccount(matched);
        setIsDemoUser(true);
        setUser({
          id: `usr-${matched.username}`,
          email: `${matched.username}@shoppulse.local`,
          user_metadata: { full_name: matched.fullName, username: matched.username, role: matched.role },
          app_metadata: {},
          aud: 'authenticated',
          created_at: matched.createdAt,
        } as unknown as User);
      }
    }
    setLoading(false);
  }, []);

  const signInWithUsername = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      return { success: false, error: 'Please enter a username.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Please enter a password.' };
    }

    const accounts = getStoredAccounts();
    const matched = accounts.find((a) => a.username.toLowerCase() === cleanUsername);

    if (!matched) {
      return { success: false, error: `Username "${username}" not found. Click "Create New Account" below to register it instantly!` };
    }

    if (matched.passwordHash !== cleanPassword) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Login successful
    setCurrentUserAccount(matched);
    setIsDemoUser(true);
    localStorage.setItem('shoppulse_active_user', matched.username);
    setUser({
      id: `usr-${matched.username}`,
      email: `${matched.username}@shoppulse.local`,
      user_metadata: { full_name: matched.fullName, username: matched.username, role: matched.role },
      app_metadata: {},
      aud: 'authenticated',
      created_at: matched.createdAt,
    } as unknown as User);

    return { success: true };
  };

  const signUpWithUsername = async (
    username: string,
    fullName: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanFullName = fullName.trim() || username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      return { success: false, error: 'Please choose a username.' };
    }
    if (cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters.' };
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const accounts = getStoredAccounts();
    const exists = accounts.some((a) => a.username.toLowerCase() === cleanUsername);
    if (exists) {
      return { success: false, error: `Username "${username}" is already taken. Please choose another username.` };
    }

    const newAccount: SimpleAccount = {
      username: cleanUsername,
      fullName: cleanFullName,
      passwordHash: cleanPassword,
      role: 'Admin',
      createdAt: new Date().toISOString(),
    };

    const updatedAccounts = [...accounts, newAccount];
    saveAccounts(updatedAccounts);

    // Auto-login upon creation
    setCurrentUserAccount(newAccount);
    setIsDemoUser(true);
    localStorage.setItem('shoppulse_active_user', newAccount.username);
    setUser({
      id: `usr-${newAccount.username}`,
      email: `${newAccount.username}@shoppulse.local`,
      user_metadata: { full_name: newAccount.fullName, username: newAccount.username, role: newAccount.role },
      app_metadata: {},
      aud: 'authenticated',
      created_at: newAccount.createdAt,
    } as unknown as User);

    return { success: true };
  };

  const signInDemo = (customName?: string) => {
    const targetName = customName?.trim() || 'Prasanna';
    const targetUsername = targetName.toLowerCase().replace(/\s+/g, '');
    const account: SimpleAccount = {
      username: targetUsername,
      fullName: `${targetName} (Admin)`,
      passwordHash: 'admin123',
      role: 'Admin',
      createdAt: new Date().toISOString(),
    };

    const accounts = getStoredAccounts();
    if (!accounts.some((a) => a.username === targetUsername)) {
      saveAccounts([...accounts, account]);
    }

    setCurrentUserAccount(account);
    setIsDemoUser(true);
    localStorage.setItem('shoppulse_active_user', account.username);
    setUser({
      id: `usr-${account.username}`,
      email: `${account.username}@shoppulse.local`,
      user_metadata: { full_name: account.fullName, username: account.username, role: account.role },
      app_metadata: {},
      aud: 'authenticated',
      created_at: account.createdAt,
    } as unknown as User);
  };

  const signOut = async () => {
    localStorage.removeItem('shoppulse_active_user');
    setCurrentUserAccount(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: null,
        loading,
        isConfigured: configured,
        isDemoUser,
        currentUserAccount,
        signInWithUsername,
        signUpWithUsername,
        signOut,
        signInDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
