import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { UserRole } from '../models';

// ─── Demo stub – no Firebase needed ──────────────────────────
const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@spectocare.app',
  displayName: 'Demo User',
  photoURL: null,
  role: 'parent' as UserRole,
};

type DemoUser = typeof DEMO_USER;

interface AuthContextValue {
  user: DemoUser | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading] = useState(false);

  const register = async (_email: string, _password: string, displayName: string, role: UserRole) => {
    setUser({ ...DEMO_USER, displayName: displayName || DEMO_USER.displayName, role });
  };

  const login = async (_email: string, _password: string) => {
    setUser(DEMO_USER);
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
