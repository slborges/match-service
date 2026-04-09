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
  Conversas: { highlightThreadId?: string } | undefined;
  Perfil: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

/** Pilha dentro do separador Perfil — perfil, publicação e lista de pedidos (cliente). */
export type ProfileStackParamList = {
  PerfilInicio: undefined;
  PedidoNovo: undefined;
  PedidosLista: undefined;
  DemandasAceitas: undefined;
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
