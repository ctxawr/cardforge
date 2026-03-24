/* useAuth.tsx — Luminous Forge v1.5 */
/* ctxAWR: Fixed GSI timing — renderButton queued until after initialize() completes.
   Uses renderButton (popup OAuth) instead of prompt() which gets suppressed. */
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
  const gsiReady = useRef(false);
  const pendingButtonEl = useRef<HTMLElement | null>(null);

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

  const doRenderButton = useCallback((el: HTMLElement) => {
    const google = (window as any).google;
    if (!google) return;
    google.accounts.id.renderButton(el, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
    });
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
      if (!google || gsiReady.current) return;

      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: true,
      });
      gsiReady.current = true;

      // Render any button that was queued before GSI was ready
      if (pendingButtonEl.current) {
        doRenderButton(pendingButtonEl.current);
        pendingButtonEl.current = null;
      }
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
  }, [handleCredentialResponse, doRenderButton]);

  /* v1.5 — ctxAWR: Queue element if GSI not yet initialized, render immediately if ready */
  const renderGoogleButton = useCallback((element: HTMLElement | null) => {
    if (!element || !CLIENT_ID) return;

    if (gsiReady.current) {
      doRenderButton(element);
    } else {
      // GSI not ready yet — queue for rendering after initialize()
      pendingButtonEl.current = element;
    }
  }, [doRenderButton]);

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
