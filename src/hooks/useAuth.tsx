/* useAuth.tsx — Luminous Forge v1.4 */
/* ctxAWR: Fixed sign-in — use renderButton (popup OAuth) instead of prompt() (One Tap) which gets silently suppressed */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  renderGoogleButton: (element: HTMLElement | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
  renderGoogleButton: () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

const STORAGE_KEY = 'cardforge_user';
const CLIENT_ID = (process.env.GOOGLE_CLIENT_ID as string) || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const gsiInitialized = useRef(false);

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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setLoading(false);

    if (!CLIENT_ID) return;

    const initGsi = () => {
      const google = (window as any).google;
      if (!google || gsiInitialized.current) return;

      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: true,
      });
      gsiInitialized.current = true;
    };

    if ((window as any).google) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google) {
          clearInterval(interval);
          initGsi();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleCredentialResponse]);

  /* v1.4 — ctxAWR: Render Google's official sign-in button into a DOM element.
     This uses popup OAuth flow which always works (unlike One Tap prompt which gets suppressed). */
  const renderGoogleButton = useCallback((element: HTMLElement | null) => {
    if (!element || !CLIENT_ID) return;
    const google = (window as any).google;
    if (!google) return;

    google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
    });
  }, []);

  const signIn = useCallback(() => {
    if (!CLIENT_ID) return;
    const google = (window as any).google;
    if (google) {
      google.accounts.id.prompt();
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    const google = (window as any).google;
    if (google) {
      google.accounts.id.disableAutoSelect();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, renderGoogleButton }}>
      {children}
    </AuthContext.Provider>
  );
}
