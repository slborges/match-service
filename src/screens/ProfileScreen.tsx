import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";

function parseSkills(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[,;]/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  if (!user) {
    return null;
  }

  const chips = parseSkills(user.skillsOrServices);

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
            {user.role === "cliente" ? "Cliente" : "Profissional"} · {user.city}
          </Text>
          <Text className="mt-1 text-xs text-slate-400">{user.email}</Text>
        </View>

        <View className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {user.role === "cliente"
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

        <View className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Reputação (mock)
          </Text>
          <Text className="mt-2 text-slate-700">
            ★ 5.0 · Perfil novo — avaliações em breve
          </Text>
        </View>

        <Pressable
          onPress={logout}
          className="mt-8 items-center rounded-xl border border-slate-200 bg-white py-4 active:bg-slate-50"
        >
          <Text className="font-semibold text-slate-700">Sair da conta</Text>
        </Pressable>

        <View className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white/80 p-4">
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
});
