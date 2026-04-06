import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AuthStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Inicio">;

export function AuthInicioScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <View className="flex-1 justify-between px-6 pb-10 pt-8">
        <View className="items-center pt-8">
          <Image
            source={require("../../../assets/icon.png")}
            className="h-28 w-28"
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Text className="mt-6 text-center text-3xl font-bold text-slate-900">
            ServLink
          </Text>
          <Text className="mt-3 max-w-[320px] text-center text-base leading-6 text-slate-500">
            Liga quem precisa de ajuda a quem sabe fazer o serviço.
          </Text>
        </View>

        <View className="gap-3">
          <Pressable
            onPress={() => navigation.navigate("Login", {})}
            className="items-center rounded-[8px] bg-blue-600 py-4 active:bg-blue-700"
          >
            <Text className="text-base font-semibold text-white">Entrar</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("BoasVindas")}
            className="items-center rounded-[8px] border border-slate-200 bg-white py-4 active:bg-slate-50"
          >
            <Text className="text-base font-semibold text-slate-800">
              Criar conta
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
