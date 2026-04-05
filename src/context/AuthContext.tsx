import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "cliente" | "profissional";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  /** Cliente: interesses; profissional: serviços */
  skillsOrServices: string;
};

export type RegistrationDraft = {
  name: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  role: UserRole;
  skillsOrServices: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  /** Último cadastro mock — usado no login após registo */
  pendingRegistration: RegistrationDraft | null;
  register: (data: RegistrationDraft) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingRegistration, setPendingRegistration] =
    useState<RegistrationDraft | null>(null);

  const register = useCallback((data: RegistrationDraft) => {
    setPendingRegistration(data);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const e = email.trim().toLowerCase();
    const p = password.trim();
    if (!e || !p) return false;

    if (pendingRegistration && pendingRegistration.email.toLowerCase() === e) {
      if (pendingRegistration.password !== p) {
        return false;
      }
      setUser({
        id: String(Date.now()),
        name: pendingRegistration.name,
        email: pendingRegistration.email,
        role: pendingRegistration.role,
        city: pendingRegistration.city,
        skillsOrServices: pendingRegistration.skillsOrServices,
      });
      setPendingRegistration(null);
      return true;
    }

    setUser({
      id: "demo",
      name: e.split("@")[0] || "Utilizador",
      email: e,
      role: "cliente",
      city: "São Paulo, SP",
      skillsOrServices: "",
    });
    return true;
  }, [pendingRegistration]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      pendingRegistration,
      register,
      login,
      logout,
    }),
    [user, pendingRegistration, register, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
