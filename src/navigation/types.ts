import type { ProfissaoSlug } from "../data/mock";
import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Inicio: undefined;
  BoasVindas: undefined;
  Cadastro: { perfil: "cliente" | "profissional" };
  Login: { email?: string } | undefined;
};

export type RootTabParamList = {
  Buscar: undefined;
  Descobrir: { profissao?: ProfissaoSlug; query?: string } | undefined;
  Conversas: NavigatorScreenParams<ChatStackParamList> | undefined;
  Perfil: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

/** Perfil da contraparte mostrado após compatibilidade aprovada (simulação). */
export type PerfilCompativelParams =
  | {
      tipo: "profissional";
      name: string;
      service: string;
      city: string;
      imageUrl: string;
      priceLabel: string;
      rating: number;
      reviewCount: number;
      profissaoLabel: string;
    }
  | {
      tipo: "cliente";
      name: string;
      city: string;
      imageUrl?: string;
      demandaTitulo: string;
      demandaResumo: string;
      demandaOrcamentoLabel: string;
      profissaoLabel: string;
    };

export type ChatStackParamList = {
  ConversasLista: { highlightThreadId?: string } | undefined;
  ConversaDetalhe: { threadId: string; threadName: string };
};

/** Pilha dentro do separador Perfil — perfil, publicação e lista de pedidos (cliente). */
export type ProfileStackParamList = {
  PerfilInicio: undefined;
  PedidoNovo: undefined;
  PedidosLista: undefined;
  DemandasAceitas: undefined;
  PerfilCompativel: PerfilCompativelParams;
  ConfirmarAcao: {
    tipo:
      | "prof-confirmar-execucao"
      | "prof-cancelar-demanda"
      | "cli-confirmar-execucao"
      | "cli-cancelar-demanda";
    demandaProfissionalId?: string;
    demandaClienteId?: string;
    titulo: string;
    mensagem: string;
    confirmarLabel: string;
  };
};
