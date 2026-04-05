import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ChatScreen } from "../screens/ChatScreen";
import { MatchScreen } from "../screens/MatchScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

export type RootTabParamList = {
  Descobrir: undefined;
  Conversas: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const accent = "#e11d48";

export function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#f1f5f9",
          paddingTop: 4,
          height: 58,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="Descobrir"
        component={MatchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Conversas"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
