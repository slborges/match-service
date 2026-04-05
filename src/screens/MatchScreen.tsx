import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  filterProfessionals,
  LABEL_PROFISSAO,
  MOCK_PROFESSIONALS,
  type Professional,
} from "../data/mock";
import type { RootTabParamList } from "../navigation/types";

export function MatchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const route = useRoute<RouteProp<RootTabParamList, "Descobrir">>();
  const params = route.params;

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const filtered = useMemo(
    () =>
      filterProfessionals(MOCK_PROFESSIONALS, {
        profissao: params?.profissao ?? null,
        query: params?.query ?? null,
      }),
    [params?.profissao, params?.query],
  );

  const [index, setIndex] = useState(0);
  const current = filtered[index];

  useEffect(() => {
    setIndex(0);
  }, [params?.profissao, params?.query]);

  const screenPadH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  /** Tablets / ecrãs largos: limita altura para o card não ficar desproporcional */
  const cardMaxHeight =
    windowWidth >= 600 ? windowHeight * 0.72 : undefined;

  const goNext = useCallback(() => {
    if (filtered.length === 0) return;
    setIndex((i) => (i + 1 >= filtered.length ? 0 : i + 1));
  }, [filtered.length]);

  const skip = useCallback(() => {
    goNext();
  }, [goNext]);

  const like = useCallback(() => {
    goNext();
  }, [goNext]);

  const temFiltro = Boolean(params?.profissao || params?.query?.trim());

  const limparFiltro = useCallback(() => {
    navigation.setParams({ profissao: undefined, query: undefined });
  }, [navigation]);

  const resumoFiltro = useMemo(() => {
    const partes: string[] = [];
    if (params?.profissao) {
      partes.push(LABEL_PROFISSAO[params.profissao]);
    }
    if (params?.query?.trim()) {
      partes.push(`“${params.query.trim()}”`);
    }
    return partes.join(" · ");
  }, [params?.profissao, params?.query]);

  if (!current) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Ionicons name="filter-outline" size={40} color="#94a3b8" />
        <Text className="mt-4 text-center text-base font-semibold text-slate-800">
          Nenhum profissional com este filtro
        </Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          Ajuste a busca na aba Buscar ou limpe o filtro.
        </Text>
        {temFiltro ? (
          <Pressable
            onPress={limparFiltro}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 active:bg-blue-700"
          >
            <Text className="font-semibold text-white">Limpar filtro</Text>
          </Pressable>
        ) : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top"]}>
      <View style={[screenPadH, styles.header]}>
        <Text className="text-center text-lg font-bold text-slate-900">
          Match Serviços
        </Text>
        <Text className="text-center text-xs text-slate-500">
          Deslize mentalmente: foto, serviço, preço, avaliação
        </Text>
        {temFiltro ? (
          <View className="mt-2 flex-row items-center justify-center gap-2 px-1">
            <View className="max-w-[90%] rounded-lg bg-blue-50 px-2 py-1.5">
              <Text className="text-center text-xs text-blue-800" numberOfLines={2}>
                Filtro: {resumoFiltro}
              </Text>
            </View>
            <Pressable
              onPress={limparFiltro}
              hitSlop={6}
              className="rounded-full bg-slate-200 p-1.5 active:bg-slate-300"
            >
              <Ionicons name="close" size={16} color="#475569" />
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Ocupa toda a altura entre título e ações — responsivo ao tamanho do ecrã */}
      <View
        style={[
          screenPadH,
          styles.cardArea,
          cardMaxHeight != null ? { maxHeight: cardMaxHeight } : null,
        ]}
      >
        <ProfileCard professional={current} />
      </View>

      <View
        style={[screenPadH, styles.actionsRow]}
        className="shrink-0 flex-row justify-center gap-8 border-t border-slate-200 bg-slate-100 pt-3"
      >
        <Pressable
          onPress={skip}
          className="h-16 w-16 items-center justify-center rounded-full border-2 border-slate-300 bg-white active:bg-slate-100"
          accessibilityLabel="Passar"
        >
          <Text className="text-3xl text-slate-500">✕</Text>
        </Pressable>
        <Pressable
          onPress={like}
          className="h-16 w-16 items-center justify-center rounded-full bg-blue-600 active:bg-blue-700"
          accessibilityLabel="Tenho interesse neste serviço"
        >
          <Ionicons name="checkmark" size={36} color="#ffffff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ProfileCard({ professional }: { professional: Professional }) {
  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardImageShell}>
        <ImageBackground
          source={{ uri: professional.imageUrl }}
          resizeMode="cover"
          style={styles.imageBackground}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(15, 23, 42, 0.55)",
              "rgba(15, 23, 42, 0.92)",
            ]}
            locations={[0, 0.42, 1]}
            style={styles.cardOverlay}
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

const styles = StyleSheet.create({
  header: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  cardArea: {
    flex: 1,
    minHeight: 0,
    paddingTop: 4,
    paddingBottom: 8,
  },
  cardOuter: {
    flex: 1,
    minHeight: 0,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#0f172a",
  },
  cardImageShell: {
    flex: 1,
    width: "100%",
    minHeight: 0,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    minHeight: 0,
    justifyContent: "flex-end",
  },
  actionsRow: {
    paddingBottom: 16,
  },
  /** iOS não aplica bem className em LinearGradient — padding explícito */
  cardOverlay: {
    width: "100%",
    paddingTop: 64,
    paddingBottom: 14,
    paddingHorizontal: 18,
  },
});
