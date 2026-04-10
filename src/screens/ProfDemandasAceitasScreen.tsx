import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeaderBar } from "../components/ScreenHeaderBar";
import { LABEL_PROFISSAO } from "../data/mock";
import {
  useAuth,
} from "../context/AuthContext";
import type { ProfileStackParamList } from "../navigation/types";

function formatDataCurta(ts: number): string {
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

export function ProfDemandasAceitasScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const {
    user,
    demandasProfissionalAceitas,
  } = useAuth();

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  const demandasOrdenadas = useMemo(
    () =>
      [...demandasProfissionalAceitas].sort(
        (a, b) => b.combinadoNoChatEm - a.combinadoNoChatEm,
      ),
    [demandasProfissionalAceitas],
  );

  if (!user || user.role !== "profissional") {
    return (
      <View className="flex-1 bg-slate-50">
        <ScreenHeaderBar
          title="Demandas compatíveis"
          onBack={() => navigation.goBack()}
        />
        <SafeAreaView className="flex-1" edges={["bottom"]}>
          <View style={[padH, styles.centered]}>
            <Ionicons name="lock-closed-outline" size={40} color="#94a3b8" />
            <Text className="mt-4 text-center text-base text-slate-700">
              Esta lista esta disponivel apenas para contas profissionais.
            </Text>
            <Pressable
              onPress={() => navigation.goBack()}
              className="mt-6 rounded-[8px] bg-blue-600 px-5 py-3 active:bg-blue-700"
            >
              <Text className="font-semibold text-white">Voltar</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScreenHeaderBar
        title="Demandas compatíveis"
        onBack={() => navigation.goBack()}
      />
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={[padH, styles.scrollContent]}
        >
          <Text className="mt-2 rounded-[8px] bg-slate-100 px-3 py-2 text-xs text-slate-600">
            Demandas combinadas no chat (mock) para acompanhamento de execucao.
          </Text>

          {demandasOrdenadas.length === 0 ? (
            <View className="mt-6 items-center rounded-[8px] border border-dashed border-slate-200 bg-white p-8">
              <Ionicons name="chatbubbles-outline" size={40} color="#94a3b8" />
              <Text className="mt-4 text-center text-sm text-slate-600">
                Ainda nao ha demandas aceitas vindas do chat.
              </Text>
            </View>
          ) : (
            <View className="mt-2 gap-3">
              {demandasOrdenadas.map((d) => (
                <View
                  key={d.id}
                  className="rounded-[8px] border border-slate-200 bg-white p-4"
                >
                  <View className="flex-row flex-wrap items-start justify-between gap-2">
                    <Text className="flex-1 text-base font-semibold text-slate-900">
                      {d.titulo}
                    </Text>
                    {d.statusExecucao === "executada" ||
                    d.statusExecucao === "nao_executada" ||
                    d.statusExecucao === "cancelada" ? (
                      <View
                        className={`rounded-[8px] px-2 py-1 ${
                          d.statusExecucao === "executada"
                            ? "bg-emerald-100"
                            : d.statusExecucao === "cancelada"
                              ? "bg-rose-100"
                              : "bg-amber-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            d.statusExecucao === "executada"
                              ? "text-emerald-800"
                              : d.statusExecucao === "cancelada"
                                ? "text-rose-800"
                                : "text-amber-900"
                          }`}
                        >
                          {d.statusExecucao === "executada"
                            ? "Executada"
                            : d.statusExecucao === "cancelada"
                              ? "Cancelada"
                              : "Nao executada"}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text className="mt-1 text-xs text-slate-500">
                    {LABEL_PROFISSAO[d.profissao]} ·{" "}
                    {formatDataCurta(d.combinadoNoChatEm)}
                  </Text>
                  <Text className="mt-2 text-sm leading-5 text-slate-600">
                    {d.resumo}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-600">
                    Cliente: {d.clienteNome}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-600">📍 {d.city}</Text>
                  {d.statusExecucao === "nao_executada" ? (
                    <View className="mt-3 gap-2">
                      <Pressable
                        onPress={() =>
                          navigation.navigate("ConfirmarAcao", {
                            tipo: "prof-cancelar-demanda",
                            demandaProfissionalId: d.id,
                            titulo: "Cancelar demanda",
                            mensagem:
                              "Esta demanda será cancelada para profissional e cliente. A ação não poderá ser revertida.",
                            confirmarLabel: "Cancelar",
                          })
                        }
                        className="items-center rounded-[8px] border border-rose-200 bg-rose-50 px-3 py-2 active:bg-rose-100"
                      >
                        <Text className="text-sm font-medium text-rose-800">
                          Cancelar
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          navigation.navigate("ConfirmarAcao", {
                            tipo: "prof-confirmar-execucao",
                            demandaProfissionalId: d.id,
                            titulo: "Confirmar execução",
                            mensagem:
                              "Ao confirmar execução, a demanda entrará em aguardando confirmação do cliente. Esta ação não poderá ser desfeita.",
                            confirmarLabel: "Confirmar execução",
                          })
                        }
                        className="items-center rounded-[8px] border border-blue-200 bg-blue-50 px-3 py-2 active:bg-blue-100"
                      >
                        <Text className="text-sm font-medium text-blue-800">
                          Confirmar execução
                        </Text>
                      </Pressable>
                    </View>
                  ) : d.statusExecucao === "aguardando_confirmacao_cliente" ? (
                    <Text className="mt-3 text-xs text-blue-700">
                      Aguardando confirmacao do cliente.
                    </Text>
                  ) : d.statusExecucao === "cancelada" ? (
                    <Text className="mt-3 text-xs text-rose-700">
                      Demanda cancelada.
                    </Text>
                  ) : (
                    <Text className="mt-3 text-xs text-emerald-700">
                      Confirmada como executada pelo cliente.
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
});
