import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import type { AuthStackParamList } from "./types";
import { stackHeaderOptions } from "./stackHeader";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
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
        options={({ navigation, route }) =>
          stackHeaderOptions(
            navigation,
            route.params.perfil === "cliente"
              ? "Cadastro — Cliente"
              : "Cadastro — Profissional",
          )
        }
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => stackHeaderOptions(navigation, "Entrar")}
      />
    </Stack.Navigator>
  );
}
