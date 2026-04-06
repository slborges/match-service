import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import type { ProfileStackParamList } from "../navigation/types";

function parseSkills(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[,;]/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user, logout } = useAuth();

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

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

        <View className="mt-8 rounded-[8px] border border-slate-200 bg-white p-5">
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

        <View className="mt-4 rounded-[8px] border border-slate-200 bg-white p-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Reputação (mock)
          </Text>
          <Text className="mt-2 text-slate-700">
            ★ 5.0 · Perfil novo — avaliações em breve
          </Text>
        </View>

        {isCliente ? (
          <View className="mt-4 overflow-hidden rounded-[8px] border border-slate-200 bg-white">
            <Pressable
              onPress={() => navigation.navigate("PedidoNovo")}
              className="flex-row items-center justify-between border-b border-slate-200 px-5 py-4 active:bg-slate-50"
            >
              <View className="flex-1 flex-row items-center gap-3 pr-2">
                <View className="rounded-[8px] bg-blue-50 p-2">
                  <Ionicons name="add-circle-outline" size={22} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-900">
                    Novo pedido de serviço
                  </Text>
                  <Text className="mt-0.5 text-sm text-slate-500">
                    Publicar o que precisas
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("PedidosLista")}
              className="flex-row items-center justify-between px-5 py-4 active:bg-slate-50"
            >
              <View className="flex-1 flex-row items-center gap-3 pr-2">
                <View className="rounded-[8px] bg-slate-100 p-2">
                  <Ionicons name="list-outline" size={22} color="#475569" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-900">
                    Os meus pedidos
                  </Text>
                  <Text className="mt-0.5 text-sm text-slate-500">
                    Atendidas e por tratar
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={logout}
          className="mt-8 items-center rounded-[8px] border border-slate-200 bg-white py-4 active:bg-slate-50"
        >
          <Text className="font-semibold text-slate-700">Sair da conta</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
});
