import { useCallback, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_PROFESSIONALS, type Professional } from "../data/mock";

export function MatchScreen() {
  const [index, setIndex] = useState(0);
  const current = MOCK_PROFESSIONALS[index];

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1 >= MOCK_PROFESSIONALS.length ? 0 : i + 1));
  }, []);

  const skip = useCallback(() => {
    goNext();
  }, [goNext]);

  const like = useCallback(() => {
    goNext();
  }, [goNext]);

  if (!current) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500">Nenhum profissional no momento.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top"]}>
      <View className="shrink-0 px-4 pb-2 pt-1">
        <Text className="text-center text-lg font-bold text-slate-900">
          Match Serviços
        </Text>
        <Text className="text-center text-xs text-slate-500">
          Deslize mentalmente: foto, serviço, preço, avaliação
        </Text>
      </View>

      {/* flex-1 + min-h-0 evita o card “vazar” por cima dos botões (overflow) */}
      <ScrollView
        className="min-h-0 flex-1"
        contentContainerClassName="px-4 pb-3 pt-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProfileCard professional={current} />
      </ScrollView>

      <View className="shrink-0 flex-row justify-center gap-8 border-t border-slate-200 bg-slate-100 px-4 pb-4 pt-3">
        <Pressable
          onPress={skip}
          className="h-16 w-16 items-center justify-center rounded-full border-2 border-slate-300 bg-white active:bg-slate-100"
          accessibilityLabel="Passar"
        >
          <Text className="text-3xl text-slate-500">✕</Text>
        </Pressable>
        <Pressable
          onPress={like}
          className="h-16 w-16 items-center justify-center rounded-full bg-rose-500 active:bg-rose-600"
          accessibilityLabel="Gostei"
        >
          <Text className="text-3xl text-white">♥</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ProfileCard({ professional }: { professional: Professional }) {
  return (
    <View className="overflow-hidden rounded-3xl bg-slate-900 shadow-sm">
      <View className="aspect-[4/5] w-full bg-slate-800">
        <ImageBackground
          source={{ uri: professional.imageUrl }}
          resizeMode="cover"
          className="h-full w-full justify-end"
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(15, 23, 42, 0.55)",
              "rgba(15, 23, 42, 0.92)",
            ]}
            locations={[0, 0.42, 1]}
            className="w-full px-5 pb-5 pt-16"
          >
            <Text className="text-2xl font-bold text-white">
              {professional.name}
            </Text>
            <Text className="mt-1 text-base text-white/85">
              {professional.service}
            </Text>
            <View className="mt-3 flex-row flex-wrap items-center gap-2">
              <Text className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                {professional.priceLabel}
              </Text>
              <Text className="text-sm text-white/80">
                ★ {professional.rating.toFixed(1)} ({professional.reviewCount}{" "}
                avaliações)
              </Text>
            </View>
            <Text className="mt-2 text-sm text-white/75">
              📍 {professional.city}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>
    </View>
  );
}
