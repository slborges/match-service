import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
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
  filterDemandas,
  filterProfessionals,
  LABEL_PROFISSAO,
  MOCK_DEMANDAS,
  MOCK_PROFESSIONALS,
  type DemandaServico,
  type Professional,
} from "../data/mock";
import { useAuth } from "../context/AuthContext";
import type { RootTabParamList } from "../navigation/types";

export function MatchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const route = useRoute<RouteProp<RootTabParamList, "Descobrir">>();
  const params = route.params;
  const { user, registrarLikeNoMatch } = useAuth();

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const isProfissional = user?.role === "profissional";

  const filtered = useMemo((): (Professional | DemandaServico)[] => {
    if (isProfissional) {
      return filterDemandas(MOCK_DEMANDAS, {
        profissao: params?.profissao ?? null,
        query: params?.query ?? null,
      });
    }
    return filterProfessionals(MOCK_PROFESSIONALS, {
      profissao: params?.profissao ?? null,
      query: params?.query ?? null,
    });
  }, [isProfissional, params?.profissao, params?.query]);

  const [index, setIndex] = useState(0);
  const [leftActionTick, setLeftActionTick] = useState(0);
  const [rightActionTick, setRightActionTick] = useState(0);
  const [leftActionIndex, setLeftActionIndex] = useState(-1);
  const [rightActionIndex, setRightActionIndex] = useState(-1);
  const [matchOverlay, setMatchOverlay] = useState<{
    visible: boolean;
    counterpartName: string;
    message: string;
    counterpartImageUrl?: string;
  }>({ visible: false, counterpartName: "", message: "" });
  const matchDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = filtered[index];

  useEffect(() => {
    setIndex(0);
    setLeftActionIndex(-1);
    setRightActionIndex(-1);
  }, [params?.profissao, params?.query, isProfissional]);

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
  }, [filtered]);

  const skip = useCallback(() => {
    setLeftActionIndex(-1);
    setRightActionIndex(-1);
    goNext();
  }, [goNext]);

  const like = useCallback(() => {
    setLeftActionIndex(-1);
    setRightActionIndex(-1);

    const filtroAtual = {
      profissaoLabel: params?.profissao ? LABEL_PROFISSAO[params.profissao] : undefined,
      query: params?.query?.trim() || undefined,
    };

    const result = isProfissional
      ? registrarLikeNoMatch({
        role: "profissional",
        demanda: current as DemandaServico,
        filtro: filtroAtual,
        })
      : registrarLikeNoMatch({
        role: "cliente",
        professional: current as Professional,
        filtro: filtroAtual,
        });

    if (result.isNew) {
      const counterpartName = isProfissional
        ? (current as DemandaServico).solicitanteLabel?.split("—")[1]?.trim() ||
          (current as DemandaServico).solicitanteLabel?.trim() ||
          "Cliente"
        : (current as Professional).name;

      const counterpartImageUrl = isProfissional
        ? (current as DemandaServico).imageUrl
        : (current as Professional).imageUrl;

      const message = isProfissional
        ? `Você foi requisitado a atender a demanda "${(current as DemandaServico).titulo}".`
        : `Você encontrou o profissional ${(current as Professional).name} para executar a demanda "${
            (current as Professional).demandaTituloMatch || "informada"
          }".`;

      setMatchOverlay({
        visible: true,
        counterpartName,
        message,
        counterpartImageUrl,
      });

      if (matchDelayRef.current) {
        clearTimeout(matchDelayRef.current);
      }

      matchDelayRef.current = setTimeout(() => {
        setMatchOverlay({ visible: false, counterpartName: "", message: "" });
        navigation.navigate("Conversas", { highlightThreadId: result.threadId });
      }, 5000);
    }

    goNext();
  }, [
    current,
    goNext,
    isProfissional,
    navigation,
    params?.profissao,
    params?.query,
    registrarLikeNoMatch,
  ]);

  useEffect(() => {
    return () => {
      if (matchDelayRef.current) {
        clearTimeout(matchDelayRef.current);
      }
    };
  }, []);

  const triggerSkipWithAnimation = useCallback(() => {
    setLeftActionIndex(index);
    setLeftActionTick((n) => n + 1);
  }, [index]);

  const triggerLikeWithAnimation = useCallback(() => {
    setRightActionIndex(index);
    setRightActionTick((n) => n + 1);
  }, [index]);

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
          {isProfissional
            ? "Nenhuma oferta de trabalho com este filtro"
            : "Nenhum profissional com este filtro"}
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
          {isProfissional ? "Oportunidades" : "ServLink"}
        </Text>
        <Text className="mt-1 text-center text-xs text-slate-500">
          Ofertas de trabalho na tua área{"\n"}Esquerda passa, direita aceita
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
        {isProfissional ? (
          <SwipeableDemandaCard
            key={`${(current as DemandaServico).id}-${index}`}
            demanda={current as DemandaServico}
            screenWidth={windowWidth}
            onSwipeLeft={skip}
            onSwipeRight={like}
            cardIndex={index}
            leftActionTick={leftActionTick}
            leftActionIndex={leftActionIndex}
            rightActionTick={rightActionTick}
            rightActionIndex={rightActionIndex}
          />
        ) : (
          <SwipeableProfileCard
            key={`${(current as Professional).id}-${index}`}
            professional={current as Professional}
            screenWidth={windowWidth}
            onSwipeLeft={skip}
            onSwipeRight={like}
            cardIndex={index}
            leftActionTick={leftActionTick}
            leftActionIndex={leftActionIndex}
            rightActionTick={rightActionTick}
            rightActionIndex={rightActionIndex}
          />
        )}
      </View>

      <View
        style={[screenPadH, styles.actionsRow]}
        className="shrink-0 border-t border-slate-200 bg-slate-100 px-2 pt-3"
      >
        <View className="flex-row items-center justify-center gap-6">
          <Pressable
            onPress={triggerSkipWithAnimation}
            accessibilityRole="button"
            accessibilityLabel="Cancelar e passar para o próximo"
            className="h-14 w-14 items-center justify-center rounded-full border-2 border-rose-300 bg-rose-50 active:bg-rose-100"
          >
            <Ionicons name="close" size={28} color="#be123c" />
          </Pressable>
          <Pressable
            onPress={triggerLikeWithAnimation}
            accessibilityRole="button"
            accessibilityLabel="Aceitar e ir para o próximo"
            className="h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-300 bg-emerald-50 active:bg-emerald-100"
          >
            <Ionicons name="checkmark" size={28} color="#15803d" />
          </Pressable>
        </View>
      </View>

      {matchOverlay.visible ? (
  <View style={StyleSheet.absoluteFillObject} className="z-50 bg-black/70">
    <LinearGradient
      colors={[
        "rgba(15,23,42,0.2)",
        "rgba(2,6,23,0.55)",
        "rgba(15,23,42,0.2)",
      ]}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 360,
            alignItems: "center",
          }}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              fontSize: 56,
              lineHeight: 60,
              fontWeight: "900",
              fontStyle: "italic",
              color: "#fff",
              textAlign: "center",
              textShadowColor: "rgba(0,0,0,0.45)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 8,
            }}
          >
            Compatibilidade aprovada!
          </Text>

          <Text
            style={{
              marginTop: 12,
              fontSize: 17,
              lineHeight: 24,
              textAlign: "center",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {matchOverlay.message}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              marginTop: 28,
            }}
          >
            <View
              style={{
                height: 96,
                width: 96,
                borderRadius: 48,
                borderWidth: 3,
                borderColor: "#fff",
                backgroundColor: "#1d4ed8",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                {(user?.name?.charAt(0) || "V").toUpperCase()}
              </Text>
            </View>

            <View
              style={{
                height: 96,
                width: 96,
                borderRadius: 48,
                borderWidth: 3,
                borderColor: "#fff",
                overflow: "hidden",
                backgroundColor: "#047857",
              }}
            >
              {matchOverlay.counterpartImageUrl ? (
                <ImageBackground
                  source={{ uri: matchOverlay.counterpartImageUrl }}
                  resizeMode="cover"
                  style={{ flex: 1 }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: "#fff",
                    }}
                  >
                    {(matchOverlay.counterpartName.charAt(0) || "C").toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  </View>
) : null}
    </SafeAreaView>
  );
}

const SWIPE_THRESHOLD = 96;
const VELOCITY_THRESHOLD = 700;

function SwipeableCardShell({
  screenWidth,
  onSwipeLeft,
  onSwipeRight,
  imageUri,
  cardIndex,
  leftActionTick,
  leftActionIndex,
  rightActionTick,
  rightActionIndex,
  children,
}: {
  screenWidth: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  imageUri: string;
  cardIndex: number;
  leftActionTick: number;
  leftActionIndex: number;
  rightActionTick: number;
  rightActionIndex: number;
  children: ReactNode;
}) {
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

  useEffect(() => {
    if (leftActionTick === 0 || leftActionIndex !== cardIndex) return;
    const off = screenWidth * 1.25;
    Animated.timing(translateX, {
      toValue: -off,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onSwipeLeft();
    });
  }, [leftActionTick, leftActionIndex, cardIndex, onSwipeLeft, screenWidth, translateX]);

  useEffect(() => {
    if (rightActionTick === 0 || rightActionIndex !== cardIndex) return;
    const off = screenWidth * 1.25;
    Animated.timing(translateX, {
      toValue: off,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onSwipeRight();
    });
  }, [
    rightActionTick,
    rightActionIndex,
    cardIndex,
    onSwipeRight,
    screenWidth,
    translateX,
  ]);

  return (
    <View style={styles.swipePanRoot} {...panResponder.panHandlers}>
      <Animated.View style={[styles.cardOuter, cardAnimatedStyle]}>
        <View style={styles.cardImageShell}>
          <ImageBackground
            source={{ uri: imageUri }}
            resizeMode="cover"
            style={styles.imageBackground}
          >
            {children}
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

function SwipeableProfileCard({
  professional,
  screenWidth,
  onSwipeLeft,
  onSwipeRight,
  cardIndex,
  leftActionTick,
  leftActionIndex,
  rightActionTick,
  rightActionIndex,
}: {
  professional: Professional;
  screenWidth: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  cardIndex: number;
  leftActionTick: number;
  leftActionIndex: number;
  rightActionTick: number;
  rightActionIndex: number;
}) {
  return (
    <SwipeableCardShell
      screenWidth={screenWidth}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      imageUri={professional.imageUrl}
      cardIndex={cardIndex}
      leftActionTick={leftActionTick}
      leftActionIndex={leftActionIndex}
      rightActionTick={rightActionTick}
      rightActionIndex={rightActionIndex}
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
        <Text className="text-2xl font-bold text-white">{professional.name}</Text>
        <Text className="mt-1 text-base text-white/85">{professional.service}</Text>
        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <Text className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
            {professional.priceLabel}
          </Text>
          <Text className="text-sm text-white/80">
            ★ {professional.rating.toFixed(1)} ({professional.reviewCount} avaliações)
          </Text>
        </View>
        <Text className="mt-2 text-sm text-white/75">📍 {professional.city}</Text>
      </LinearGradient>
    </SwipeableCardShell>
  );
}

function SwipeableDemandaCard({
  demanda,
  screenWidth,
  onSwipeLeft,
  onSwipeRight,
  cardIndex,
  leftActionTick,
  leftActionIndex,
  rightActionTick,
  rightActionIndex,
}: {
  demanda: DemandaServico;
  screenWidth: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  cardIndex: number;
  leftActionTick: number;
  leftActionIndex: number;
  rightActionTick: number;
  rightActionIndex: number;
}) {
  return (
    <SwipeableCardShell
      screenWidth={screenWidth}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      imageUri={demanda.imageUrl}
      cardIndex={cardIndex}
      leftActionTick={leftActionTick}
      leftActionIndex={leftActionIndex}
      rightActionTick={rightActionTick}
      rightActionIndex={rightActionIndex}
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
        <Text
          className="text-xs font-semibold uppercase text-amber-300"
          numberOfLines={1}
        >
          {LABEL_PROFISSAO[demanda.profissao]} · {demanda.publicadoEm}
        </Text>
        <Text className="mt-2 text-xl font-bold text-white" numberOfLines={3}>
          {demanda.titulo}
        </Text>
        <Text className="mt-2 text-sm leading-5 text-white/85" numberOfLines={4}>
          {demanda.resumo}
        </Text>
        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <Text className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
            {demanda.orcamentoLabel}
          </Text>
          {demanda.solicitanteLabel ? (
            <Text className="text-xs text-white/75" numberOfLines={1}>
              {demanda.solicitanteLabel}
            </Text>
          ) : null}
        </View>
        <Text className="mt-2 text-sm text-white/75">📍 {demanda.city}</Text>
      </LinearGradient>
    </SwipeableCardShell>
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
    borderWidth: 1,
    borderColor: "#e2e8f0",
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
    justifyContent: "center",
    alignItems: "center",
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
