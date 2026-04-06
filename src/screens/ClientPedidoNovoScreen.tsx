import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
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
import { TAGS_SERVICOS_POPULARES } from "../data/mock";
import { useAuth } from "../context/AuthContext";
import type { ProfileStackParamList } from "../navigation/types";

export function ClientPedidoNovoScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user, addDemandaCliente } = useAuth();

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

  useEffect(() => {
    if (user?.role === "cliente" && user.city) {
      setCityPedido(user.city);
    }
  }, [user?.id, user?.role, user?.city]);

  const syncCityFromUser = useCallback(() => {
    if (user?.city) setCityPedido(user.city);
  }, [user?.city]);

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
    navigation.navigate("PedidosLista");
  }, [
    user,
    titulo,
    resumo,
    profissao,
    orcamento,
    cityPedido,
    addDemandaCliente,
    navigation,
  ]);

  if (!user || user.role !== "cliente") {
    return (
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <View style={[padH, styles.centered]}>
          <Ionicons name="lock-closed-outline" size={40} color="#94a3b8" />
          <Text className="mt-4 text-center text-base text-slate-700">
            Novo pedido está disponível apenas para contas de cliente.
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
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mt-2 text-sm text-slate-500">
          Descreve o que precisas. Os dados ficam nesta sessão (mock).
        </Text>

        <Text className="mt-6 text-xs font-medium text-slate-600">
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
          className="mt-1 rounded-[8px] border border-slate-200 bg-white px-3 py-3 text-base text-slate-900"
        />

        <Text className="mt-4 text-xs font-medium text-slate-600">Detalhes</Text>
        <TextInput
          value={resumo}
          onChangeText={setResumo}
          placeholder="Prazo, acesso ao local, materiais…"
          placeholderTextColor="#94a3b8"
          multiline
          textAlignVertical="top"
          className="mt-1 min-h-[88px] rounded-[8px] border border-slate-200 bg-white px-3 py-3 text-base text-slate-900"
        />

        <Text className="mt-4 text-xs font-medium text-slate-600">
          Orçamento pretendido (opcional)
        </Text>
        <TextInput
          value={orcamento}
          onChangeText={setOrcamento}
          placeholder="Ex.: Até R$ 500"
          placeholderTextColor="#94a3b8"
          className="mt-1 rounded-[8px] border border-slate-200 bg-white px-3 py-3 text-base text-slate-900"
        />

        <Text className="mt-4 text-xs font-medium text-slate-600">
          Cidade / região do serviço
        </Text>
        <TextInput
          value={cityPedido}
          onChangeText={setCityPedido}
          placeholder={user.city}
          placeholderTextColor="#94a3b8"
          className="mt-1 rounded-[8px] border border-slate-200 bg-white px-3 py-3 text-base text-slate-900"
        />
        <Pressable onPress={syncCityFromUser} className="mt-1 self-start">
          <Text className="text-xs text-blue-600">Usar cidade do perfil</Text>
        </Pressable>

        <Pressable
          onPress={enviarPedido}
          className="mt-6 items-center rounded-[8px] bg-blue-600 py-3.5 active:bg-blue-700"
        >
          <Text className="font-semibold text-white">Publicar pedido</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
});
