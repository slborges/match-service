import { Feather } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const accent = "#2563eb";

/** Mesmo fundo que `bg-slate-50` no ecrã de cadastro — evita faixa branca no header. */
const cadastroScreenBg = "#f8fafc";

const styles = StyleSheet.create({
  cadastroHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cadastroHeaderTitle: {
    marginLeft: 12,
    fontSize: 17,
    fontWeight: "600",
    color: "#0f172a",
  },
  cadastroBackPressable: {
    backgroundColor: "transparent",
  },
});

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: accent,
        headerTitleStyle: { fontWeight: "600", color: "#0f172a" },
        contentStyle: { backgroundColor: "#f8fafc" },
      }}
    >
      <Stack.Screen
        name="BoasVindas"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cadastro"
        component={RegisterScreen}
        options={({ navigation, route }) => {
          const title =
            route.params.perfil === "cliente"
              ? "Cadastro — Cliente"
              : "Cadastro — Profissional";
          return {
            headerTitle: "",
            headerStyle: { backgroundColor: cadastroScreenBg },
            /** No iOS: seta estilo Feather (linha + ponta), como na referência — não o chevron do sistema. */
            headerLeft: () => (
              <View style={styles.cadastroHeaderRow}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Voltar"
                  android_ripple={null}
                  style={({ pressed }) => [
                    styles.cadastroBackPressable,
                    { opacity: pressed ? 0.55 : 1 },
                  ]}
                >
                  <Feather name="arrow-left" size={22} color={accent} />
                </Pressable>
                <Text style={styles.cadastroHeaderTitle} numberOfLines={1}>
                  {title}
                </Text>
              </View>
            ),
            headerLeftContainerStyle: {
              backgroundColor: "transparent",
              ...(Platform.OS === "ios"
                ? { paddingLeft: 8 }
                : { paddingLeft: 4 }),
            },
          };
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Entrar",
          headerBackTitle: "Voltar",
        }}
      />
    </Stack.Navigator>
  );
}
