import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const accent = "#2563eb";

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
        options={({ route }) => ({
          title:
            route.params.perfil === "cliente"
              ? "Cadastro — Cliente"
              : "Cadastro — Profissional",
          headerBackTitle: "Voltar",
        })}
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
