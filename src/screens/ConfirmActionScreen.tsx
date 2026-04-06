import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeaderBar } from "../components/ScreenHeaderBar";
import { useAuth } from "../context/AuthContext";
import type { ProfileStackParamList } from "../navigation/types";

type Nav = NativeStackNavigationProp<ProfileStackParamList, "ConfirmarAcao">;
type Route = RouteProp<ProfileStackParamList, "ConfirmarAcao">;

export function ConfirmActionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {
    confirmarExecucaoDemandaCliente,
    profissionalSolicitarConfirmacaoExecucao,
    cancelarDemandaCliente,
    cancelarDemandaProfissional,
  } = useAuth();

  const confirmar = () => {
    const p = route.params;
    if (p.tipo === "prof-confirmar-execucao" && p.demandaProfissionalId) {
      profissionalSolicitarConfirmacaoExecucao(p.demandaProfissionalId);
    } else if (p.tipo === "prof-cancelar-demanda" && p.demandaProfissionalId) {
      cancelarDemandaProfissional(p.demandaProfissionalId);
    } else if (p.tipo === "cli-confirmar-execucao" && p.demandaClienteId) {
      confirmarExecucaoDemandaCliente(p.demandaClienteId);
    } else if (p.tipo === "cli-cancelar-demanda" && p.demandaClienteId) {
      cancelarDemandaCliente(p.demandaClienteId);
    }
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScreenHeaderBar
        title="Confirmar ação"
        onBack={() => navigation.goBack()}
      />
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <View className="flex-1 justify-between px-5 py-6">
          <View className="rounded-[8px] border border-slate-200 bg-white p-5">
            <Text className="text-lg font-bold text-slate-900">
              {route.params.titulo}
            </Text>
            <Text className="mt-3 text-sm leading-6 text-slate-600">
              {route.params.mensagem}
            </Text>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={confirmar}
              className="items-center rounded-[8px] bg-blue-600 py-4 active:bg-blue-700"
            >
              <Text className="text-base font-semibold text-white">
                {route.params.confirmarLabel}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.goBack()}
              className="items-center rounded-[8px] border border-slate-200 bg-white py-4 active:bg-slate-50"
            >
              <Text className="text-base font-semibold text-slate-800">
                Voltar
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
