import type { ProfissaoSlug } from "../data/mock";

export type AuthStackParamList = {
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
