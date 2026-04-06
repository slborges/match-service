import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import type { ProfissaoSlug } from "../data/mock";
import { LABEL_PROFISSAO, TAGS_SERVICOS_POPULARES } from "../data/mock";
import { useAuth } from "../context/AuthContext";
import type { DemandaCliente, DemandaClienteStatus } from "../context/AuthContext";

function parseSkills(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[,;]/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatDataCriada(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    user,
    logout,
    demandasCliente,
    addDemandaCliente,
    setDemandaClienteStatus,
  } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [cityPedido, setCityPedido] = useState("");
  const [profissao, setProfissao] = useState<ProfissaoSlug>(
    TAGS_SERVICOS_POPULARES[0].slug,
  );

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  const demandasOrdenadas = useMemo(
    () => [...demandasCliente].sort((a, b) => b.criadaEm - a.criadaEm),
    [demandasCliente],
  );

  const syncCityFromUser = useCallback(() => {
    if (user?.city) setCityPedido(user.city);
  }, [user?.city]);

  useEffect(() => {
    if (user?.role === "cliente" && user.city) {
      setCityPedido(user.city);
    }
  }, [user?.id, user?.role, user?.city]);

  const enviarPedido = useCallback(() => {
    if (!user || user.role !== "cliente") return;
    addDemandaCliente({
      titulo,
      resumo,
      profissao,
      orcamentoLabel: orcamento,
      city: cityPedido || user.city,
    });
    setTitulo("");
    setResumo("");
    setOrcamento("");
  }, [
    user,
    titulo,
    resumo,
    profissao,
    orcamento,
    cityPedido,
    addDemandaCliente,
  ]);

  const alternarStatus = useCallback(
    (d: DemandaCliente) => {
      const next: DemandaClienteStatus =
        d.status === "pendente" ? "atendida" : "pendente";
      setDemandaClienteStatus(d.id, next);
    },
    [setDemandaClienteStatus],
  );

  if (!user) {
    return null;
  }

  const chips = parseSkills(user.skillsOrServices);
  const isCliente = user.role === "cliente";

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={[padH, styles.scrollContent]}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-6">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-600">
            <Text className="text-3xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="mt-4 text-2xl font-bold text-slate-900">{user.name}</Text>
          <Text className="mt-1 text-slate-500">
            {isCliente ? "Cliente" : "Profissional"} · {user.city}
          </Text>
          <Text className="mt-1 text-xs text-slate-400">{user.email}</Text>
        </View>

        <View className="mt-8 rounded-[8px] bg-white p-5 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {isCliente
              ? "Interesses / serviços procurados"
              : "Serviços / áreas"}
          </Text>
          {chips.length > 0 ? (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {chips.map((s) => (
                <View
                  key={s}
                  className="rounded-full bg-slate-100 px-3 py-1.5"
                >
                  <Text className="text-sm text-slate-700">{s}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="mt-2 text-sm text-slate-500">—</Text>
          )}
        </View>

        {isCliente ? (
          <>
            <View className="mt-4 rounded-[8px] bg-white p-5 shadow-sm">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Novo pedido de serviço
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                Descreva o que precisa. Fica guardado nesta sessão (mock).
              </Text>

              <Text className="mt-4 text-xs font-medium text-slate-600">
                Profissão / área
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-2"
                contentContainerStyle={styles.chipsRow}
              >
                {TAGS_SERVICOS_POPULARES.map((t) => {
                  const active = profissao === t.slug;
                  return (
                    <Pressable
                      key={t.slug}
                      onPress={() => setProfissao(t.slug)}
                      className={`mr-2 rounded-[8px] px-3 py-2 ${
                        active ? "bg-blue-600" : "bg-slate-100"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          active ? "text-white" : "text-slate-700"
                        }`}
                      >
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text className="mt-4 text-xs font-medium text-slate-600">
                Título do pedido
              </Text>
              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ex.: Instalar luminárias na sala"
                placeholderTextColor="#94a3b8"
                className="mt-1 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-900"
              />

              <Text className="mt-4 text-xs font-medium text-slate-600">
                Detalhes
              </Text>
              <TextInput
                value={resumo}
                onChangeText={setResumo}
                placeholder="Prazo, acesso ao local, materiais…"
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
                className="mt-1 min-h-[88px] rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-900"
              />

              <Text className="mt-4 text-xs font-medium text-slate-600">
                Orçamento pretendido (opcional)
              </Text>
              <TextInput
                value={orcamento}
                onChangeText={setOrcamento}
                placeholder="Ex.: Até R$ 500"
                placeholderTextColor="#94a3b8"
                className="mt-1 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-900"
              />

              <Text className="mt-4 text-xs font-medium text-slate-600">
                Cidade / região do serviço
              </Text>
              <TextInput
                value={cityPedido}
                onChangeText={setCityPedido}
                placeholder={user.city}
                placeholderTextColor="#94a3b8"
                className="mt-1 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-900"
              />
              <Pressable onPress={syncCityFromUser} className="mt-1 self-start">
                <Text className="text-xs text-blue-600">Usar cidade do perfil</Text>
              </Pressable>

              <Pressable
                onPress={enviarPedido}
                className="mt-5 items-center rounded-[8px] bg-blue-600 py-3.5 active:bg-blue-700"
              >
                <Text className="font-semibold text-white">Publicar pedido</Text>
              </Pressable>
            </View>

            <View className="mt-4 rounded-[8px] bg-white p-5 shadow-sm">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Os meus pedidos
              </Text>
              {demandasOrdenadas.length === 0 ? (
                <Text className="mt-3 text-sm text-slate-500">
                  Ainda não há pedidos. Cria um acima.
                </Text>
              ) : (
                <View className="mt-3 gap-3">
                  {demandasOrdenadas.map((d) => (
                    <View
                      key={d.id}
                      className="rounded-[8px] border border-slate-100 bg-slate-50 p-4"
                    >
                      <View className="flex-row flex-wrap items-start justify-between gap-2">
                        <Text className="flex-1 text-base font-semibold text-slate-900">
                          {d.titulo}
                        </Text>
                        <View
                          className={`rounded-[8px] px-2 py-1 ${
                            d.status === "atendida"
                              ? "bg-emerald-100"
                              : "bg-amber-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              d.status === "atendida"
                                ? "text-emerald-800"
                                : "text-amber-900"
                            }`}
                          >
                            {d.status === "atendida"
                              ? "Atendida"
                              : "Não atendida"}
                          </Text>
                        </View>
                      </View>
                      <Text className="mt-1 text-xs text-slate-500">
                        {LABEL_PROFISSAO[d.profissao]} ·{" "}
                        {formatDataCriada(d.criadaEm)}
                      </Text>
                      <Text className="mt-2 text-sm leading-5 text-slate-600">
                        {d.resumo}
                      </Text>
                      {d.orcamentoLabel ? (
                        <Text className="mt-2 text-sm text-slate-700">
                          Orçamento: {d.orcamentoLabel}
                        </Text>
                      ) : null}
                      <Text className="mt-1 text-sm text-slate-600">
                        📍 {d.city}
                      </Text>
                      <Pressable
                        onPress={() => alternarStatus(d)}
                        className="mt-3 self-start rounded-[8px] border border-slate-200 bg-white px-3 py-2 active:bg-slate-50"
                      >
                        <Text className="text-sm font-medium text-slate-700">
                          {d.status === "pendente"
                            ? "Marcar como atendida"
                            : "Marcar como não atendida"}
                        </Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : null}

        <View className="mt-4 rounded-[8px] bg-white p-5 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Reputação (mock)
          </Text>
          <Text className="mt-2 text-slate-700">
            ★ 5.0 · Perfil novo — avaliações em breve
          </Text>
        </View>

        <Pressable
          onPress={logout}
          className="mt-8 items-center rounded-[8px] border border-slate-200 bg-white py-4 active:bg-slate-50"
        >
          <Text className="font-semibold text-slate-700">Sair da conta</Text>
        </Pressable>

        <View className="mt-6 rounded-[8px] border border-dashed border-slate-300 bg-white/80 p-4">
          <Text className="text-center text-sm text-slate-500">
            Sessão mockada — ao sair voltas ao ecrã de boas-vindas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
});
