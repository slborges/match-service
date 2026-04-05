import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { useCallback, useState } from "react";
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

type Nav = NativeStackNavigationProp<AuthStackParamList, "Cadastro">;
type Route = RouteProp<AuthStackParamList, "Cadastro">;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { register } = useAuth();
  const perfil = route.params.perfil;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [extras, setExtras] = useState("");

  const onSubmit = useCallback(() => {
    if (!name.trim() || !email.trim() || !city.trim()) {
      Alert.alert("Campos obrigatórios", "Preenche nome, email e cidade.");
      return;
    }
    if (password.length < 4) {
      Alert.alert("Palavra-passe", "Usa pelo menos 4 caracteres (demo).");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Confirmação", "As palavras-passe não coincidem.");
      return;
    }
    if (perfil === "cliente" && !extras.trim()) {
      Alert.alert(
        "Interesses",
        "Indica que tipo de serviços procuras (ex.: elétrica, limpeza).",
      );
      return;
    }
    if (perfil === "profissional" && !extras.trim()) {
      Alert.alert(
        "Serviços",
        "Descreve brevemente os serviços que ofereces.",
      );
      return;
    }

    register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      password,
      role: perfil,
      skillsOrServices: extras.trim(),
    });

    navigation.navigate("Login", { email: email.trim() });
  }, [
    name,
    email,
    city,
    password,
    confirm,
    extras,
    perfil,
    register,
    navigation,
  ]);

  const extrasLabel =
    perfil === "cliente"
      ? "Que serviços procuras?"
      : "Que serviços ofereces?";

  const extrasHint =
    perfil === "cliente"
      ? "Ex.: eletricista, canalização, limpeza…"
      : "Ex.: instalações elétricas, pintura, montagem…";

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-6 text-sm leading-5 text-slate-600">
          {perfil === "cliente"
            ? "Cria a tua conta de cliente. Depois vais poder entrar com email e palavra-passe."
            : "Cria a tua conta de profissional. Os clientes vão ver o que ofereces após o match."}
        </Text>

        <Field label="Nome completo *" value={name} onChangeText={setName} />
        <Field
          label="Email *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Field
          label="Telefone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Field label="Cidade / região *" value={city} onChangeText={setCity} />

        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-slate-700">
            {extrasLabel} *
          </Text>
          <TextInput
            value={extras}
            onChangeText={setExtras}
            placeholder={extrasHint}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
          />
        </View>

        <Field
          label="Palavra-passe *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Field
          label="Confirmar palavra-passe *"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          onPress={onSubmit}
          className="mt-4 items-center rounded-xl bg-blue-600 py-4 active:bg-blue-700"
        >
          <Text className="text-base font-semibold text-white">
            Concluir cadastro
          </Text>
        </Pressable>

        <Text className="mt-4 text-center text-xs text-slate-400">
          Demo sem backend — dados só em memória nesta sessão.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences";
  autoCorrect?: boolean;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-slate-700">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? "default"}
        autoCapitalize={autoCapitalize ?? "sentences"}
        autoCorrect={autoCorrect ?? true}
        placeholderTextColor="#94a3b8"
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
      />
    </View>
  );
}
