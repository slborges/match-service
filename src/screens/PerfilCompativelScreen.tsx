import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeaderBar } from "../components/ScreenHeaderBar";
import { iniciaisNomeSobrenome } from "../utils/iniciaisNomeSobrenome";
import type { ProfileStackParamList } from "../navigation/types";

export function PerfilCompativelScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route = useRoute<RouteProp<ProfileStackParamList, "PerfilCompativel">>();
  const p = route.params;

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  const avatar =
    p.tipo === "profissional" ? (
      <Image
        source={{ uri: p.imageUrl }}
        style={styles.avatarImage}
        accessibilityLabel={`Foto de ${p.name}`}
      />
    ) : p.imageUrl ? (
      <Image
        source={{ uri: p.imageUrl }}
        style={styles.avatarImage}
        accessibilityLabel={`Foto de ${p.name}`}
      />
    ) : (
      <View
        style={[styles.avatarImage, styles.avatarPlaceholder]}
        accessibilityLabel={`Avatar de ${p.name}`}
      >
        <Text style={styles.avatarInitial}>
          {iniciaisNomeSobrenome(p.name, "C")}
        </Text>
      </View>
    );

  const subline =
    p.tipo === "profissional"
      ? `Profissional · ${p.city}`
      : `Cliente · ${p.city}`;
  const abrirConversaPrivada = () => {
    if (!p.chatThreadId || !p.chatThreadName) {
      navigation.navigate("Conversas", { screen: "ConversasLista" });
      return;
    }
    navigation.navigate("Conversas", {
      screen: "ConversaDetalhe",
      params: {
        threadId: p.chatThreadId,
        threadName: p.chatThreadName,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScreenHeaderBar title="Perfil" onBack={() => navigation.goBack()} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={[padH, styles.scrollContent]}
      >
        <View className="items-center pt-6">
          {avatar}
          <Text
            className="mt-4 text-center text-2xl font-bold text-slate-900"
            numberOfLines={p.tipo === "profissional" ? 2 : 2}
          >
            {p.name}
          </Text>
          <Text className="mt-1 text-slate-500">{subline}</Text>
          <Text className="mt-1 text-xs text-slate-400">
            Perfil público (simulação)
          </Text>
        </View>

        {p.tipo === "profissional" ? (
          <>
            <View className="mt-8 rounded-[8px] border border-slate-200 bg-white p-5">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Serviços / áreas
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-2">
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-sm text-slate-700">{p.profissaoLabel}</Text>
                </View>
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-sm text-slate-700">{p.service}</Text>
                </View>
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-sm text-slate-700">{p.priceLabel}</Text>
                </View>
              </View>
            </View>
            <View className="mt-4 rounded-[8px] border border-slate-200 bg-white p-5">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Reputação (mock)
              </Text>
              <Text className="mt-2 text-slate-700">
                ★ {p.rating.toFixed(1)} · {p.reviewCount} avaliações
              </Text>
            </View>
            <Pressable
              onPress={abrirConversaPrivada}
              className="mt-4 items-center rounded-[8px] bg-blue-600 py-4 active:bg-blue-700"
            >
              <Text className="text-base font-semibold text-white">Conversar</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View className="mt-8 rounded-[8px] border border-slate-200 bg-white p-5">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Interesses
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-2">
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-sm text-slate-700">{p.profissaoLabel}</Text>
                </View>
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-sm text-slate-700">Contratar serviço</Text>
                </View>
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-sm text-slate-700">Demanda ativa</Text>
                </View>
              </View>
            </View>
            <View className="mt-4 rounded-[8px] border border-slate-200 bg-white p-5">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Demanda publicada
              </Text>
              <Text className="mt-3 text-base font-semibold text-slate-900">
                {p.demandaTitulo}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-700">
                {p.demandaResumo}
              </Text>
              <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Orçamento indicado
              </Text>
              <Text className="mt-2 text-slate-700">{p.demandaOrcamentoLabel}</Text>
            </View>
            <Pressable
              onPress={abrirConversaPrivada}
              className="mt-4 items-center rounded-[8px] bg-blue-600 py-4 active:bg-blue-700"
            >
              <Text className="text-base font-semibold text-white">Conversar</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e2e8f0",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#64748b",
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
});
