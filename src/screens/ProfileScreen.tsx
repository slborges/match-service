import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_CURRENT_USER } from "../data/mock";

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const u = MOCK_CURRENT_USER;

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={[padH, styles.scrollContent]}
      >
        <View className="items-center pt-6">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-600">
            <Text className="text-3xl font-bold text-white">
              {u.name.charAt(0)}
            </Text>
          </View>
          <Text className="mt-4 text-2xl font-bold text-slate-900">{u.name}</Text>
          <Text className="mt-1 text-slate-500">
            {u.role === "cliente" ? "Cliente" : "Profissional"} · {u.city}
          </Text>
        </View>

        <View className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Interesses / serviços
          </Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {u.skills.map((s) => (
              <View
                key={s}
                className="rounded-full bg-slate-100 px-3 py-1.5"
              >
                <Text className="text-sm text-slate-700">{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Reputação (mock)
          </Text>
          <Text className="mt-2 text-slate-700">
            ★ {u.rating.toFixed(1)} · {u.completedJobs} serviços concluídos
          </Text>
        </View>

        <View className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white/80 p-4">
          <Text className="text-center text-sm text-slate-500">
            Cadastro completo, filtros e pagamentos entram nas próximas fases — sem
            backend por enquanto.
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
