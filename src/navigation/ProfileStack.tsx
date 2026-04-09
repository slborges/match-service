import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ClientPedidoNovoScreen } from "../screens/ClientPedidoNovoScreen";
import { ClientPedidosListaScreen } from "../screens/ClientPedidosListaScreen";
import { ConfirmActionScreen } from "../screens/ConfirmActionScreen";
import { ProfDemandasAceitasScreen } from "../screens/ProfDemandasAceitasScreen";
import { PerfilCompativelScreen } from "../screens/PerfilCompativelScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import type { ProfileStackParamList } from "./types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: "#f8fafc" },
      }}
    >
      <Stack.Screen
        name="PerfilInicio"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PedidoNovo"
        component={ClientPedidoNovoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PedidosLista"
        component={ClientPedidosListaScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DemandasAceitas"
        component={ProfDemandasAceitasScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PerfilCompativel"
        component={PerfilCompativelScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmarAcao"
        component={ConfirmActionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
