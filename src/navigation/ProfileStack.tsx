import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ClientPedidoNovoScreen } from "../screens/ClientPedidoNovoScreen";
import { ClientPedidosListaScreen } from "../screens/ClientPedidosListaScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { stackHeaderOptions } from "./stackHeader";
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
        options={({ navigation }) =>
          stackHeaderOptions(navigation, "Novo pedido")
        }
      />
      <Stack.Screen
        name="PedidosLista"
        component={ClientPedidosListaScreen}
        options={({ navigation }) =>
          stackHeaderOptions(navigation, "Os meus pedidos")
        }
      />
    </Stack.Navigator>
  );
}
