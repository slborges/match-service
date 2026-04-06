import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  MOCK_DEMANDAS_ACEITAS_PROFISSIONAL,
  type ProfissaoSlug,
} from "../data/mock";

export type UserRole = "cliente" | "profissional";

/** Pedido criado pelo cliente no perfil (mock local até existir API). */
export type DemandaClienteStatus = "pendente" | "atendida";

export type DemandaCliente = {
  id: string;
  titulo: string;
  resumo: string;
  profissao: ProfissaoSlug;
  orcamentoLabel: string;
  city: string;
  status: DemandaClienteStatus;
  criadaEm: number;
};

export type NovaDemandaClienteInput = {
  titulo: string;
  resumo: string;
  profissao: ProfissaoSlug;
  orcamentoLabel: string;
  city: string;
};

export type DemandaProfissionalAceitaStatus = "executada" | "nao_executada";

export type DemandaProfissionalAceita = {
  id: string;
  titulo: string;
  resumo: string;
  profissao: ProfissaoSlug;
  city: string;
  clienteNome: string;
  combinadoNoChatEm: number;
  statusExecucao: DemandaProfissionalAceitaStatus;
};

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

/** Senha partilhada pelas contas demo (login manual no ecrã Entrar). */
export const DEMO_LOGIN_PASSWORD = "demo123";

type AuthContextValue = {
  user: AuthUser | null;
  /** Último cadastro mock — usado no login após registo */
  pendingRegistration: RegistrationDraft | null;
  /** Pedidos do cliente (só relevante quando `user.role === "cliente"`). */
  demandasCliente: DemandaCliente[];
  /** Demandas aceitas no chat (só relevante quando `user.role === "profissional"`). */
  demandasProfissionalAceitas: DemandaProfissionalAceita[];
  addDemandaCliente: (input: NovaDemandaClienteInput) => void;
  setDemandaClienteStatus: (
    id: string,
    status: DemandaClienteStatus,
  ) => void;
  setDemandaProfissionalAceitaStatus: (
    id: string,
    status: DemandaProfissionalAceitaStatus,
  ) => void;
  register: (data: RegistrationDraft) => void;
  login: (email: string, password: string) => boolean;
  /** Entrada instantânea com perfil de demonstração (cliente ou profissional). */
  loginDemo: (role: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function novoIdDemandaCliente(): string {
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingRegistration, setPendingRegistration] =
    useState<RegistrationDraft | null>(null);
  const [demandasCliente, setDemandasCliente] = useState<DemandaCliente[]>([]);
  const [demandasProfissionalAceitas, setDemandasProfissionalAceitas] = useState<
    DemandaProfissionalAceita[]
  >(() => MOCK_DEMANDAS_ACEITAS_PROFISSIONAL);

  const addDemandaCliente = useCallback((input: NovaDemandaClienteInput) => {
    const t = input.titulo.trim();
    const r = input.resumo.trim();
    if (!t || !r) return;
    const row: DemandaCliente = {
      id: novoIdDemandaCliente(),
      titulo: t,
      resumo: r,
      profissao: input.profissao,
      orcamentoLabel: input.orcamentoLabel.trim(),
      city: input.city.trim() || "—",
      status: "pendente",
      criadaEm: Date.now(),
    };
    setDemandasCliente((prev) => [row, ...prev]);
  }, []);

  const setDemandaClienteStatus = useCallback(
    (id: string, status: DemandaClienteStatus) => {
      setDemandasCliente((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d)),
      );
    },
    [],
  );

  const setDemandaProfissionalAceitaStatus = useCallback(
    (id: string, status: DemandaProfissionalAceitaStatus) => {
      setDemandasProfissionalAceitas((prev) =>
        prev.map((d) => (d.id === id ? { ...d, statusExecucao: status } : d)),
      );
    },
    [],
  );

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
    setDemandasCliente([]);
    setDemandasProfissionalAceitas(MOCK_DEMANDAS_ACEITAS_PROFISSIONAL);
  }, []);

  const value = useMemo(
    () => ({
      user,
      pendingRegistration,
      demandasCliente,
      demandasProfissionalAceitas,
      addDemandaCliente,
      setDemandaClienteStatus,
      setDemandaProfissionalAceitaStatus,
      register,
      login,
      loginDemo,
      logout,
    }),
    [
      user,
      pendingRegistration,
      demandasCliente,
      demandasProfissionalAceitas,
      addDemandaCliente,
      setDemandaClienteStatus,
      setDemandaProfissionalAceitaStatus,
      register,
      login,
      loginDemo,
      logout,
    ],
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
