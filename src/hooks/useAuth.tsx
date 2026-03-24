// v1.0 — ctxAWR: Google Sign-In via Google Identity Services (GSI)
// Purpose: Client-side auth for GitHub Pages SPA — no backend needed
// Context: Decodes JWT credential from Google to get name, email, picture
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as React from 'react';

interface User {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

// v1.0 — ctxAWR: Decode JWT payload without external library
function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

const STORAGE_KEY = 'cardforge_user';
const CLIENT_ID = (process.env.GOOGLE_CLIENT_ID as string) || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCredentialResponse = useCallback((response: { credential: string }) => {
    const payload = decodeJwtPayload(response.credential);
    const userData: User = {
      name: String(payload.name ?? ''),
      email: String(payload.email ?? ''),
      picture: String(payload.picture ?? ''),
      sub: String(payload.sub ?? ''),
    };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, []);

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore corrupt data */ }
    }
    setLoading(false);

    if (!CLIENT_ID) return;

    // Wait for GSI script to load
    const initGsi = () => {
      const google = (window as unknown as { google?: { accounts: { id: {
        initialize: (config: Record<string, unknown>) => void;
        prompt: () => void;
      } } } }).google;
      if (!google) return;

      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: true,
      });

      // Show One Tap if no user stored
      if (!stored) {
        google.accounts.id.prompt();
      }
    };

    // GSI script may not be loaded yet
    if ((window as unknown as { google?: unknown }).google) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if ((window as unknown as { google?: unknown }).google) {
          clearInterval(interval);
          initGsi();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleCredentialResponse]);

  const signIn = useCallback(() => {
    if (!CLIENT_ID) return;
    const google = (window as unknown as { google?: { accounts: { id: {
      prompt: () => void;
    } } } }).google;
    if (google) {
      google.accounts.id.prompt();
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    const google = (window as unknown as { google?: { accounts: { id: {
      disableAutoSelect: () => void;
    } } } }).google;
    if (google) {
      google.accounts.id.disableAutoSelect();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
