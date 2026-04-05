export type AuthStackParamList = {
  BoasVindas: undefined;
  Cadastro: { perfil: "cliente" | "profissional" };
  Login: { email?: string } | undefined;
};
