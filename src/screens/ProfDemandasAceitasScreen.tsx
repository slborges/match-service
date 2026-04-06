import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeaderBar } from "../components/ScreenHeaderBar";
import { LABEL_PROFISSAO } from "../data/mock";
import {
  useAuth,
  type DemandaProfissionalAceita,
  type DemandaProfissionalAceitaStatus,
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
    setDemandaProfissionalAceitaStatus,
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

  const alternarStatus = useCallback(
    (d: DemandaProfissionalAceita) => {
      const next: DemandaProfissionalAceitaStatus =
        d.statusExecucao === "executada" ? "nao_executada" : "executada";
      setDemandaProfissionalAceitaStatus(d.id, next);
    },
    [setDemandaProfissionalAceitaStatus],
  );

  if (!user || user.role !== "profissional") {
    return (
      <View className="flex-1 bg-slate-50">
        <ScreenHeaderBar
          title="Demandas aceitas"
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
        title="Demandas aceitas"
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
                    <View
                      className={`rounded-[8px] px-2 py-1 ${
                        d.statusExecucao === "executada"
                          ? "bg-emerald-100"
                          : "bg-amber-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          d.statusExecucao === "executada"
                            ? "text-emerald-800"
                            : "text-amber-900"
                        }`}
                      >
                        {d.statusExecucao === "executada"
                          ? "Executada"
                          : "Nao executada"}
                      </Text>
                    </View>
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
                  <Pressable
                    onPress={() => alternarStatus(d)}
                    className="mt-3 self-start rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2 active:bg-slate-100"
                  >
                    <Text className="text-sm font-medium text-slate-700">
                      {d.statusExecucao === "executada"
                        ? "Marcar como nao executada"
                        : "Marcar como executada"}
                    </Text>
                  </Pressable>
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
