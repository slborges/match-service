import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import type { AuthStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Login">;
type Route = RouteProp<AuthStackParamList, "Login">;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { login } = useAuth();

  const [email, setEmail] = useState(route.params?.email ?? "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  const onSubmit = useCallback(() => {
    const ok = login(email.trim(), password);
    if (!ok) {
      Alert.alert(
        "Não foi possível entrar",
        "Verifique o email e a palavra-passe. Se acabou de se registar, use a mesma palavra-passe do cadastro.",
      );
    }
  }, [email, password, login]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center px-5 pb-10 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-6 text-center text-sm leading-5 text-slate-600">
          Usa o mesmo email e palavra-passe do cadastro. Se acabaste de te
          registar, já estão pré-preenchidos.
        </Text>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-slate-700">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="nome@email.com"
            placeholderTextColor="#94a3b8"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-slate-700">
            Palavra-passe
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
          />
        </View>

        <Pressable
          onPress={onSubmit}
          className="items-center rounded-xl bg-blue-600 py-4 active:bg-blue-700"
        >
          <Text className="text-base font-semibold text-white">Entrar</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("BoasVindas")}
          className="mt-8 items-center py-2"
        >
          <Text className="text-center text-sm text-slate-500">
            Ainda não tens conta?{" "}
            <Text className="font-semibold text-blue-600">Criar conta</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
