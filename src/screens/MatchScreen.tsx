import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  PanResponder,
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
            className="mt-6 rounded-[8px] bg-blue-600 px-5 py-3 active:bg-blue-700"
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
          Deslize o card para decidir — veja a dica em baixo
        </Text>
        {temFiltro ? (
          <View className="mt-2 flex-row items-center justify-center gap-2 px-1">
            <View className="max-w-[90%] rounded-[8px] bg-blue-50 px-2 py-1.5">
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
        <SwipeableProfileCard
          key={`${current.id}-${index}`}
          professional={current}
          screenWidth={windowWidth}
          onSwipeLeft={skip}
          onSwipeRight={like}
        />
      </View>

      <View
        style={[screenPadH, styles.actionsRow]}
        className="shrink-0 border-t border-slate-200 bg-slate-100 px-2 pt-3"
      >
        <Text style={styles.hintTitle}>Como decidir</Text>
        <Text style={styles.hintLine}>
          <Text style={styles.hintEm}>← Esquerda</Text>
          <Text style={styles.hintBody}> = deslike (passar para o próximo)</Text>
        </Text>
        <Text style={styles.hintLine}>
          <Text style={styles.hintEm}>→ Direita</Text>
          <Text style={styles.hintBody}> = like (tenho interesse neste perfil)</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const SWIPE_THRESHOLD = 96;
const VELOCITY_THRESHOLD = 700;

function SwipeableProfileCard({
  professional,
  screenWidth,
  onSwipeLeft,
  onSwipeRight,
}: {
  professional: Professional;
  screenWidth: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  /** RN `Animated` puro — evita Reanimated/worklets (crash Hermes no iPhone). */
  const translateX = useRef(new Animated.Value(0)).current;

  const rotateZ = translateX.interpolate({
    inputRange: [-screenWidth * 0.4, 0, screenWidth * 0.4],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const dislikeOpacity = translateX.interpolate({
    inputRange: [-140, -36, 0],
    outputRange: [1, 0.35, 0],
    extrapolate: "clamp",
  });

  const dislikeScale = translateX.interpolate({
    inputRange: [-140, 0],
    outputRange: [1, 0.65],
    extrapolate: "clamp",
  });

  const likeOpacity = translateX.interpolate({
    inputRange: [0, 36, 140],
    outputRange: [0, 0.35, 1],
    extrapolate: "clamp",
  });

  const likeScale = translateX.interpolate({
    inputRange: [0, 140],
    outputRange: [0.65, 1],
    extrapolate: "clamp",
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 6,
        onPanResponderMove: (_, g) => {
          translateX.setValue(g.dx);
        },
        onPanResponderRelease: (_, g) => {
          const tx = g.dx;
          const v = g.vx;
          const off = screenWidth * 1.25;
          if (tx < -SWIPE_THRESHOLD || v < -VELOCITY_THRESHOLD) {
            Animated.timing(translateX, {
              toValue: -off,
              duration: 220,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) onSwipeLeft();
            });
          } else if (tx > SWIPE_THRESHOLD || v > VELOCITY_THRESHOLD) {
            Animated.timing(translateX, {
              toValue: off,
              duration: 220,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) onSwipeRight();
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              friction: 7,
              tension: 80,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [screenWidth, translateX, onSwipeLeft, onSwipeRight],
  );

  const cardAnimatedStyle = {
    transform: [{ translateX }, { rotate: rotateZ }],
  };

  const dislikeOverlayStyle = {
    opacity: dislikeOpacity,
    transform: [{ scale: dislikeScale }],
  };

  const likeOverlayStyle = {
    opacity: likeOpacity,
    transform: [{ scale: likeScale }],
  };

  return (
    <View style={styles.swipePanRoot} {...panResponder.panHandlers}>
      <Animated.View style={[styles.cardOuter, cardAnimatedStyle]}>
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
            <View
              pointerEvents="none"
              style={styles.swipeOverlayLayer}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Animated.View style={[styles.swipeStamp, dislikeOverlayStyle]}>
                <View style={styles.stampCircleNope}>
                  <Ionicons name="close" size={56} color="#fef2f2" />
                </View>
              </Animated.View>
              <Animated.View style={[styles.swipeStamp, likeOverlayStyle]}>
                <View style={styles.stampCircleLike}>
                  <Ionicons name="checkmark" size={56} color="#f0fdf4" />
                </View>
              </Animated.View>
            </View>
          </ImageBackground>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  swipePanRoot: {
    flex: 1,
    minHeight: 0,
  },
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
  swipeOverlayLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeStamp: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  stampCircleNope: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: "rgba(239, 68, 68, 0.95)",
    backgroundColor: "rgba(239, 68, 68, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  stampCircleLike: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: "rgba(34, 197, 94, 0.95)",
    backgroundColor: "rgba(34, 197, 94, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
    marginBottom: 8,
  },
  hintLine: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 4,
  },
  hintEm: {
    fontWeight: "700",
    color: "#0f172a",
  },
  hintBody: {
    fontWeight: "400",
    color: "#475569",
  },
});
