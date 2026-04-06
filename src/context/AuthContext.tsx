import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  IMAGEM_CARD_PROFISSAO,
  MOCK_DEMANDAS_ACEITAS_PROFISSIONAL,
  MOCK_PEDIDOS_CLIENTE,
  type ProfissaoSlug,
} from "../data/mock";

export type UserRole = "cliente" | "profissional";

/** Pedido criado pelo cliente no perfil (mock local até existir API). */
export type DemandaClienteStatus = "pendente" | "atendida" | "cancelada";

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

export type DemandaProfissionalAceitaStatus =
  | "nao_executada"
  | "aguardando_confirmacao_cliente"
  | "executada"
  | "cancelada";

export type DemandaProfissionalAceita = {
  id: string;
  demandaClienteId?: string;
  titulo: string;
  resumo: string;
  profissao: ProfissaoSlug;
  imageUrl: string;
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
  confirmarExecucaoDemandaCliente: (demandaClienteId: string) => boolean;
  profissionalSolicitarConfirmacaoExecucao: (demandaProfissionalId: string) => boolean;
  cancelarDemandaCliente: (demandaClienteId: string) => boolean;
  cancelarDemandaProfissional: (demandaProfissionalId: string) => boolean;
  register: (data: RegistrationDraft) => void;
  login: (email: string, password: string) => boolean;
  /** Entrada instantânea com perfil de demonstração (cliente ou profissional). */
  loginDemo: (role: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY_DEMANDAS_CLIENTE = "@servlink:demandasCliente";
const STORAGE_KEY_DEMANDAS_PRO_ACEITAS = "@servlink:demandasProfissionalAceitas";

function novoIdDemandaCliente(): string {
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function novoIdDemandaProfissionalAceita(): string {
  return `dap-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingRegistration, setPendingRegistration] =
    useState<RegistrationDraft | null>(null);
  const [demandasCliente, setDemandasCliente] = useState<DemandaCliente[]>([]);
  const [demandasProfissionalAceitas, setDemandasProfissionalAceitas] = useState<
    DemandaProfissionalAceita[]
  >(() => MOCK_DEMANDAS_ACEITAS_PROFISSIONAL);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [rawCliente, rawProf] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_DEMANDAS_CLIENTE),
          AsyncStorage.getItem(STORAGE_KEY_DEMANDAS_PRO_ACEITAS),
        ]);
        if (!mounted) return;
        if (rawCliente) {
          setDemandasCliente(JSON.parse(rawCliente) as DemandaCliente[]);
        }
        if (rawProf) {
          setDemandasProfissionalAceitas(
            JSON.parse(rawProf) as DemandaProfissionalAceita[],
          );
        }
      } catch {
        // Em modo mock, falha de persistência não bloqueia uso da app.
      } finally {
        hydratedRef.current = true;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    AsyncStorage.setItem(
      STORAGE_KEY_DEMANDAS_CLIENTE,
      JSON.stringify(demandasCliente),
    ).catch(() => {});
  }, [demandasCliente]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    AsyncStorage.setItem(
      STORAGE_KEY_DEMANDAS_PRO_ACEITAS,
      JSON.stringify(demandasProfissionalAceitas),
    ).catch(() => {});
  }, [demandasProfissionalAceitas]);

  const addDemandaCliente = useCallback(
    (input: NovaDemandaClienteInput) => {
      const t = input.titulo.trim();
      const r = input.resumo.trim();
      if (!t || !r) return;

      const now = Date.now();
      const demandaClienteId = novoIdDemandaCliente();
      const city = input.city.trim() || "—";
      const orcamentoLabel = input.orcamentoLabel.trim();

      const row: DemandaCliente = {
        id: demandaClienteId,
        titulo: t,
        resumo: r,
        profissao: input.profissao,
        orcamentoLabel,
        city,
        status: "pendente",
        criadaEm: now,
      };
      setDemandasCliente((prev) => [row, ...prev]);

      // Espelha no lado profissional para permitir testes ponta a ponta das confirmações.
      setDemandasProfissionalAceitas((prev) => [
        {
          id: novoIdDemandaProfissionalAceita(),
          demandaClienteId,
          titulo: t,
          resumo: r,
          profissao: input.profissao,
          imageUrl: IMAGEM_CARD_PROFISSAO[input.profissao],
          city,
          clienteNome: user?.name || "Cliente",
          combinadoNoChatEm: now,
          statusExecucao: "nao_executada",
        },
        ...prev,
      ]);
    },
    [user?.name],
  );

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

  const confirmarExecucaoDemandaCliente = useCallback(
    (demandaClienteId: string) => {
      const baseCliente = demandasCliente.length > 0 ? demandasCliente : MOCK_PEDIDOS_CLIENTE;
      const pedido = baseCliente.find((d) => d.id === demandaClienteId);
      if (!pedido || pedido.status !== "pendente") return false;

      setDemandasCliente(
        baseCliente.map((d) =>
          d.id === demandaClienteId ? { ...d, status: "atendida" } : d,
        ),
      );

      setDemandasProfissionalAceitas((prev) =>
        prev.map((d) =>
          d.demandaClienteId === demandaClienteId &&
          d.statusExecucao !== "cancelada"
            ? { ...d, statusExecucao: "executada" }
            : d,
        ),
      );

      return true;
    },
    [demandasCliente],
  );

  const profissionalSolicitarConfirmacaoExecucao = useCallback(
    (demandaProfissionalId: string) => {
      let alterou = false;
      setDemandasProfissionalAceitas((prev) =>
        prev.map((d) => {
          if (d.id !== demandaProfissionalId) return d;
          if (d.statusExecucao !== "nao_executada") return d;
          alterou = true;
          return { ...d, statusExecucao: "aguardando_confirmacao_cliente" };
        }),
      );
      return alterou;
    },
    [],
  );

  const cancelarDemandaCliente = useCallback(
    (demandaClienteId: string) => {
      const baseCliente = demandasCliente.length > 0 ? demandasCliente : MOCK_PEDIDOS_CLIENTE;
      const alvoCliente = baseCliente.find((d) => d.id === demandaClienteId);
      if (!alvoCliente || alvoCliente.status !== "pendente") return false;

      setDemandasCliente(baseCliente.map((d) =>
        d.id === demandaClienteId ? { ...d, status: "cancelada" } : d,
      ));

      setDemandasProfissionalAceitas((prev) =>
        prev.map((d) =>
          d.demandaClienteId === demandaClienteId && d.statusExecucao !== "executada"
            ? { ...d, statusExecucao: "cancelada" }
            : d,
        ),
      );

      return true;
    },
    [demandasCliente],
  );

  const cancelarDemandaProfissional = useCallback(
    (demandaProfissionalId: string) => {
      const alvo = demandasProfissionalAceitas.find((d) => d.id === demandaProfissionalId);
      if (!alvo || alvo.statusExecucao !== "nao_executada") return false;

      setDemandasProfissionalAceitas((prev) =>
        prev.map((d) =>
          d.id === demandaProfissionalId ? { ...d, statusExecucao: "cancelada" } : d,
        ),
      );

      if (alvo.demandaClienteId) {
        setDemandasCliente((prev) => {
          const base = prev.length > 0 ? prev : MOCK_PEDIDOS_CLIENTE;
          return base.map((d) =>
            d.id === alvo.demandaClienteId && d.status === "pendente"
              ? { ...d, status: "cancelada" }
              : d,
          );
        });
      }

      return true;
    },
    [demandasProfissionalAceitas, demandasCliente],
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
    // Mantém dados para permitir teste de cruzamento cliente x profissional entre logins.
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
      confirmarExecucaoDemandaCliente,
      profissionalSolicitarConfirmacaoExecucao,
      cancelarDemandaCliente,
      cancelarDemandaProfissional,
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
      confirmarExecucaoDemandaCliente,
      profissionalSolicitarConfirmacaoExecucao,
      cancelarDemandaCliente,
      cancelarDemandaProfissional,
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
