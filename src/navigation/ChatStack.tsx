import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ChatScreen } from "../screens/ChatScreen";
import { ChatThreadScreen } from "../screens/ChatThreadScreen";
import type { ChatStackParamList } from "./types";

const Stack = createNativeStackNavigator<ChatStackParamList>();

export function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConversasLista" component={ChatScreen} />
      <Stack.Screen name="ConversaDetalhe" component={ChatThreadScreen} />
    </Stack.Navigator>
  );
}

