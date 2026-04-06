import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { LABEL_PROFISSAO, MOCK_PEDIDOS_CLIENTE } from "../data/mock";
import {
  useAuth,
  type DemandaCliente,
  type DemandaClienteStatus,
} from "../context/AuthContext";
import type { ProfileStackParamList } from "../navigation/types";

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

export function ClientPedidosListaScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user, demandasCliente, setDemandaClienteStatus } = useAuth();

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  /** Com pedidos reais na sessão mostra só esses; senão mostra `MOCK_PEDIDOS_CLIENTE` de `mock.ts`. */
  const demandasOrdenadas = useMemo(() => {
    const fonte =
      demandasCliente.length > 0 ? demandasCliente : MOCK_PEDIDOS_CLIENTE;
    return [...fonte].sort((a, b) => b.criadaEm - a.criadaEm);
  }, [demandasCliente]);

  const listaSoExemplosMock = demandasCliente.length === 0;

  const alternarStatus = useCallback(
    (d: DemandaCliente) => {
      const next: DemandaClienteStatus =
        d.status === "pendente" ? "atendida" : "pendente";
      setDemandaClienteStatus(d.id, next);
    },
    [setDemandaClienteStatus],
  );

  if (!user || user.role !== "cliente") {
    return (
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <View style={[padH, styles.centered]}>
          <Ionicons name="lock-closed-outline" size={40} color="#94a3b8" />
          <Text className="mt-4 text-center text-base text-slate-700">
            A lista de pedidos está disponível apenas para contas de cliente.
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            className="mt-6 rounded-[8px] bg-blue-600 px-5 py-3 active:bg-blue-700"
          >
            <Text className="font-semibold text-white">Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={[padH, styles.scrollContent]}
      >
        {listaSoExemplosMock ? (
          <Text className="mt-2 rounded-[8px] bg-slate-100 px-3 py-2 text-xs text-slate-600">
            Exemplos (mock) — quando publicares um pedido, a lista mostra só os teus.
          </Text>
        ) : null}

        {demandasOrdenadas.length === 0 ? (
          <View className="mt-6 items-center rounded-[8px] border border-dashed border-slate-200 bg-white p-8">
            <Ionicons name="document-text-outline" size={40} color="#94a3b8" />
            <Text className="mt-4 text-center text-sm text-slate-600">
              Lista vazia. Cria um pedido em «Novo pedido».
            </Text>
            <Pressable
              onPress={() => navigation.navigate("PedidoNovo")}
              className="mt-5 rounded-[8px] bg-blue-600 px-5 py-3 active:bg-blue-700"
            >
              <Text className="font-semibold text-white">Novo pedido</Text>
            </Pressable>
          </View>
        ) : (
          <View className="mt-2 gap-3">
            {demandasOrdenadas.map((d) => (
              <View
                key={d.id}
                className="rounded-[8px] border border-slate-100 bg-white p-4 shadow-sm"
              >
                <View className="flex-row flex-wrap items-start justify-between gap-2">
                  <Text className="flex-1 text-base font-semibold text-slate-900">
                    {d.titulo}
                  </Text>
                  <View
                    className={`rounded-[8px] px-2 py-1 ${
                      d.status === "atendida" ? "bg-emerald-100" : "bg-amber-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        d.status === "atendida"
                          ? "text-emerald-800"
                          : "text-amber-900"
                      }`}
                    >
                      {d.status === "atendida" ? "Atendida" : "Não atendida"}
                    </Text>
                  </View>
                </View>
                <Text className="mt-1 text-xs text-slate-500">
                  {LABEL_PROFISSAO[d.profissao]} · {formatDataCriada(d.criadaEm)}
                </Text>
                <Text className="mt-2 text-sm leading-5 text-slate-600">
                  {d.resumo}
                </Text>
                {d.orcamentoLabel ? (
                  <Text className="mt-2 text-sm text-slate-700">
                    Orçamento: {d.orcamentoLabel}
                  </Text>
                ) : null}
                <Text className="mt-1 text-sm text-slate-600">📍 {d.city}</Text>
                {listaSoExemplosMock ? (
                  <Text className="mt-3 text-xs text-slate-400">
                    Pedido de exemplo (mock)
                  </Text>
                ) : (
                  <Pressable
                    onPress={() => alternarStatus(d)}
                    className="mt-3 self-start rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2 active:bg-slate-100"
                  >
                    <Text className="text-sm font-medium text-slate-700">
                      {d.status === "pendente"
                        ? "Marcar como atendida"
                        : "Marcar como não atendida"}
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
