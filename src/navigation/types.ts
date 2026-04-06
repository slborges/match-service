import type { ProfissaoSlug } from "../data/mock";

export type AuthStackParamList = {
  Inicio: undefined;
  BoasVindas: undefined;
  Cadastro: { perfil: "cliente" | "profissional" };
  Login: { email?: string } | undefined;
};

export type RootTabParamList = {
  Buscar: undefined;
  Descobrir: { profissao?: ProfissaoSlug; query?: string } | undefined;
  Conversas: undefined;
  Perfil: undefined;
};

/** Pilha dentro do separador Perfil — perfil, publicação e lista de pedidos (cliente). */
export type ProfileStackParamList = {
  PerfilInicio: undefined;
  PedidoNovo: undefined;
  PedidosLista: undefined;
  DemandasAceitas: undefined;
};
