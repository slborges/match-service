import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Defs, Path, RadialGradient, Stop } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import type { AuthStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Inicio">;

const NAVY = "#0c1e3d";
const MUTED = "#64748b";
const WAVE_H = 96;

function CurvedWhiteTransition({ width }: { width: number }) {
  const { dMain, dSoft } = useMemo(() => {
    const w = width;
    const H = WAVE_H;
    const yL = 26;
    const yR = 30;
    const yMid = 72;
    const main = [
      `M 0 ${yL}`,
      `C ${w * 0.12} ${yL - 4} ${w * 0.28} ${yMid - 6} ${w * 0.5} ${yMid}`,
      `C ${w * 0.72} ${yMid + 4} ${w * 0.88} ${yR - 2} ${w} ${yR}`,
      `L ${w} ${H} L 0 ${H} Z`,
    ].join(" ");

    const yL2 = 18;
    const yR2 = 22;
    const yMid2 = 58;
    const soft = [
      `M 0 ${yL2}`,
      `C ${w * 0.15} ${yL2 - 6} ${w * 0.32} ${yMid2} ${w * 0.5} ${yMid2 + 2}`,
      `C ${w * 0.68} ${yMid2} ${w * 0.9} ${yR2 + 4} ${w} ${yR2}`,
      `L ${w} ${H} L 0 ${H} Z`,
    ].join(" ");

    return { dMain: main, dSoft: soft };
  }, [width]);

  return (
    <Svg width={width} height={WAVE_H} viewBox={`0 0 ${width} ${WAVE_H}`}>
      <Defs>
        <RadialGradient id="softGlow" cx="50%" cy="0%" rx="75%" ry="90%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Path d={dSoft} fill="url(#softGlow)" opacity={0.35} />
      <Path d={dMain} fill="#ffffff" />
    </Svg>
  );
}

export function AuthInicioScreen() {
  const navigation = useNavigation<Nav>();
  const { width, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  /** Altura da faixa hero (gradiente + logo) antes da onda. */
  const heroBodyH = Math.min(300, windowHeight * 0.4);

  useFocusEffect(
    useCallback(() => {
      RNStatusBar.setBarStyle("light-content");
      if (Platform.OS === "android") {
        RNStatusBar.setBackgroundColor("#1e40af");
      }
      return () => {
        RNStatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
          RNStatusBar.setBackgroundColor("#ffffff");
        }
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeRoot} edges={["bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 16 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces
      >
        {/* —— Bloco superior: gradiente + formas + logo + onda (fluxo do ScrollView — nada cobre o azul) —— */}
        <View style={styles.heroFullBleed}>
          <View style={[styles.heroBlock, { paddingTop: insets.top, minHeight: heroBodyH }]}>
            <LinearGradient
              colors={["#172554", "#1e3a8a", "#1d4ed8", "#2563eb", "#3b82f6"]}
              locations={[0, 0.2, 0.45, 0.72, 1]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.orb, styles.orb1]} pointerEvents="none" />
            <View style={[styles.orb, styles.orb2]} pointerEvents="none" />
            <View style={[styles.orb, styles.orb3]} pointerEvents="none" />
            <LinearGradient
              colors={["rgba(255,255,255,0.14)", "transparent"]}
              style={styles.vignetteTop}
              pointerEvents="none"
            />

            <View style={styles.logoWrap}>
              <View style={styles.logoMark}>
                <Image
                  source={require("../../../assets/icon.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
              </View>
            </View>
          </View>

          <View style={[styles.waveClip, { marginTop: -(WAVE_H - 12) }]}>
            <CurvedWhiteTransition width={width} />
          </View>
        </View>

        {/* —— Zona branca: título e botões —— */}
        <View style={styles.whiteSection}>
          <Text style={styles.title}>ServLink</Text>
          <Text style={styles.tagline}>
            Liga quem precisa de ajuda a quem sabe fazer o serviço.
          </Text>

          <View className="mt-9 gap-3">
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroFullBleed: {
    width: "100%",
    alignSelf: "stretch",
  },
  heroBlock: {
    width: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orb1: {
    width: 220,
    height: 220,
    top: -30,
    right: -70,
    backgroundColor: "rgba(147, 197, 253, 0.35)",
  },
  orb2: {
    width: 160,
    height: 160,
    top: 90,
    left: -55,
    backgroundColor: "rgba(96, 165, 250, 0.28)",
  },
  orb3: {
    width: 280,
    height: 280,
    bottom: -100,
    left: "12%",
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  vignetteTop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  logoWrap: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMark: {
    padding: 14,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  logoImage: {
    width: 72,
    height: 72,
  },
  waveClip: {
    width: "100%",
    backgroundColor: "transparent",
    marginBottom: -8,
  },
  whiteSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "600",
    letterSpacing: -0.4,
    color: NAVY,
    marginTop: 4,
  },
  tagline: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: MUTED,
    paddingHorizontal: 8,
  },
});
