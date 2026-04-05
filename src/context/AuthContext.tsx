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

/** Utilizadores fixos para simulação rápida na tela de login (sem backend). */
export const DEMO_USER_CLIENTE: AuthUser = {
  id: "sim-cliente",
  name: "Maria Silva",
  email: "cliente@match.com",
  role: "cliente",
  city: "São Paulo — Zona Sul",
  skillsOrServices: "Elétrica, Limpeza, Pequenas reformas",
};

export const DEMO_USER_PROFISSIONAL: AuthUser = {
  id: "sim-profissional",
  name: "João Instalações",
  email: "profissional@match.com",
  role: "profissional",
  city: "São Paulo — Grande SP",
  skillsOrServices: "Instalações elétricas, quadros, iluminação, revisões",
};

/** Palavra-passe partilhada pelas contas demo (login manual no ecrã Entrar). */
export const DEMO_LOGIN_PASSWORD = "demo123";

type AuthContextValue = {
  user: AuthUser | null;
  /** Último cadastro mock — usado no login após registo */
  pendingRegistration: RegistrationDraft | null;
  register: (data: RegistrationDraft) => void;
  login: (email: string, password: string) => boolean;
  /** Entrada instantânea com perfil de demonstração (cliente ou profissional). */
  loginDemo: (role: UserRole) => void;
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

    const demoClienteEmail = DEMO_USER_CLIENTE.email.toLowerCase();
    const demoProEmail = DEMO_USER_PROFISSIONAL.email.toLowerCase();
    if (e === demoClienteEmail || e === demoProEmail) {
      if (p !== DEMO_LOGIN_PASSWORD) {
        return false;
      }
      setUser(e === demoClienteEmail ? DEMO_USER_CLIENTE : DEMO_USER_PROFISSIONAL);
      setPendingRegistration(null);
      return true;
    }

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

  const loginDemo = useCallback((role: UserRole) => {
    setPendingRegistration(null);
    setUser(role === "cliente" ? DEMO_USER_CLIENTE : DEMO_USER_PROFISSIONAL);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      pendingRegistration,
      register,
      login,
      loginDemo,
      logout,
    }),
    [user, pendingRegistration, register, login, loginDemo, logout],
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
