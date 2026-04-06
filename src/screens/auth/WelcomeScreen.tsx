import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeaderBar } from "../../components/ScreenHeaderBar";
import type { AuthStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<AuthStackParamList, "BoasVindas">;

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View className="flex-1 bg-slate-50">
      <ScreenHeaderBar
        title="Criar conta"
        onBack={() => navigation.goBack()}
      />
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow px-5 pb-8 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-8 text-center text-base leading-6 text-slate-500">
            Encontre profissionais ou ofereça o seu trabalho — escolha como quer
            usar a app.
          </Text>

          <Pressable
            onPress={() =>
              navigation.navigate("Cadastro", { perfil: "cliente" })
            }
            className="relative mb-4 overflow-hidden rounded-[8px] border border-slate-200 bg-white active:bg-slate-50"
          >
            <View className="absolute right-3 top-3 z-10">
              <Ionicons name="person" size={20} color="#2563eb" />
            </View>
            <View className="p-5 pr-12">
              <Text className="text-lg font-bold text-slate-900">Cliente</Text>
              <Text className="mt-2 text-sm leading-5 text-slate-600">
                Procure profissionais para serviços em casa ou no trabalho. Veja
                perfis, preços e avaliações, faça match e converse quando quiser
                fechar um serviço.
              </Text>
              <Text className="mt-3 text-sm font-semibold text-blue-600">
                Criar conta como cliente →
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("Cadastro", { perfil: "profissional" })
            }
            className="relative overflow-hidden rounded-[8px] border border-slate-200 bg-white active:bg-slate-50"
          >
            <View className="absolute right-3 top-3 z-10">
              <Ionicons name="briefcase" size={20} color="#2563eb" />
            </View>
            <View className="p-5 pr-12">
              <Text className="text-lg font-bold text-slate-900">
                Profissional
              </Text>
              <Text className="mt-2 text-sm leading-5 text-slate-600">
                Ofereça seus serviços a clientes na sua região. Mostre o que faz,
                defina disponibilidade e receba pedidos de quem precisa da sua
                área.
              </Text>
              <Text className="mt-3 text-sm font-semibold text-blue-600">
                Criar conta como profissional →
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
