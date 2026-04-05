import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import type { RootTabParamList } from "../navigation/types";
import {
  filterDemandas,
  filterProfessionals,
  IMAGEM_CARD_PROFISSAO,
  MOCK_DEMANDAS,
  MOCK_PROFESSIONALS,
  TAGS_SERVICOS_POPULARES,
  type ProfissaoSlug,
} from "../data/mock";

const CARD_GAP = 12;

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<ProfissaoSlug | null>(null);

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  /** Largura útil da lista = ecrã menos padding horizontal do ecrã Buscar. */
  const innerWidth = windowWidth - 32 - insets.left - insets.right;
  /** ~2,5 cards visíveis por vez (o último “cortado” indica rolagem). */
  const cardWidth = innerWidth / 2.5;

  const isCliente = user?.role === "cliente";

  const resultadoDeck = useMemo(() => {
    if (isCliente) {
      return filterProfessionals(MOCK_PROFESSIONALS, {
        profissao: tag,
        query: query.trim() || null,
      });
    }
    return filterDemandas(MOCK_DEMANDAS, {
      profissao: tag,
      query: query.trim() || null,
    });
  }, [isCliente, query, tag]);

  const abrirDescobrir = useCallback(() => {
    navigation.navigate("Descobrir", {
      profissao: tag ?? undefined,
      query: query.trim() || undefined,
    });
  }, [navigation, tag, query]);

  const aoEscolherTag = useCallback(
    (slug: ProfissaoSlug) => {
      const next = tag === slug ? null : slug;
      setTag(next);
      navigation.navigate("Descobrir", {
        profissao: next ?? undefined,
        query: query.trim() || undefined,
      });
    },
    [navigation, query, tag],
  );

  const onSubmitBusca = useCallback(() => {
    abrirDescobrir();
  }, [abrirDescobrir]);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View style={padH} className="border-b border-slate-100 bg-white pb-3 pt-2">
        <Text className="text-xl font-bold text-slate-900">Buscar</Text>
        <Text className="mt-0.5 text-sm text-slate-500">
          {isCliente
            ? "Escolha uma categoria ou pesquise e abra o Descobrir para ver os cards."
            : "Escolha uma área ou pesquise — no Descobrir vê ofertas de trabalho (pedidos de clientes) para deslizar."}
        </Text>
        <View className="mt-3 flex-row items-center rounded-[8px] border border-slate-200 bg-slate-50 px-3">
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={onSubmitBusca}
            returnKeyType="search"
            placeholder={
              isCliente
                ? "Ex.: eletricista, Pinheiros, Maria…"
                : "Ex.: encanador, pintura, orçamento…"
            }
            placeholderTextColor="#94a3b8"
            className="ml-2 flex-1 py-3 text-base text-slate-900"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={22} color="#94a3b8" />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          onPress={onSubmitBusca}
          className="mt-3 flex-row items-center justify-center rounded-[8px] bg-blue-600 py-3 active:bg-blue-700"
        >
          <Ionicons name="flame" size={20} color="#fff" />
          <Text className="ml-2 text-base font-semibold text-white">
            {isCliente ? "Ver no Descobrir (match)" : "Ver ofertas no Descobrir"}
          </Text>
        </Pressable>

        <Text className="mt-2 text-center text-xs text-slate-400">
          Com o filtro atual: {resultadoDeck.length}{" "}
          {isCliente
            ? resultadoDeck.length === 1
              ? "profissional"
              : "profissionais"
            : resultadoDeck.length === 1
              ? "oferta"
              : "ofertas"}{" "}
          no deck
        </Text>
      </View>

      <View style={padH} className="flex-1 bg-white pb-4 pt-3">
        <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {isCliente ? "Serviços mais procurados" : "Áreas com mais pedidos"}
        </Text>
        <FlatList
          data={[...TAGS_SERVICOS_POPULARES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.slug}
          snapToInterval={cardWidth + CARD_GAP}
          decelerationRate="fast"
          /** Altura da viewport = altura do card (quadrado), sem faixa vazia por baixo. */
          style={{ height: cardWidth }}
          contentContainerStyle={styles.carouselContent}
          renderItem={({ item }) => {
            const active = tag === item.slug;
            return (
              <Pressable
                onPress={() => aoEscolherTag(item.slug)}
                style={[
                  styles.card,
                  {
                    width: cardWidth,
                    height: cardWidth,
                    marginRight: CARD_GAP,
                    borderColor: active ? "#2563eb" : "#e2e8f0",
                    borderWidth: active ? 2 : 1,
                  },
                ]}
              >
                <ImageBackground
                  source={{ uri: IMAGEM_CARD_PROFISSAO[item.slug] }}
                  style={styles.cardImageBg}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(15, 23, 42, 0.5)",
                      "rgba(15, 23, 42, 0.92)",
                    ]}
                    locations={[0, 0.45, 1]}
                    style={styles.cardGradient}
                  >
                    <Text style={styles.cardLabelOverlay} numberOfLines={2}>
                      {item.label}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
                {active ? (
                  <View style={styles.cardBadge}>
                    <Ionicons name="checkmark-circle" size={22} color="#ffffff" />
                  </View>
                ) : null}
              </Pressable>
            );
          }}
        />

        <Text className="mt-5 text-center text-sm leading-5 text-slate-500">
          {isCliente
            ? "Deslize para o lado para ver todas as categorias. Toque num card para abrir o Descobrir com esse filtro."
            : "Deslize para ver todas as áreas. Toque num card para abrir o Descobrir com ofertas de trabalho nessa área."}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  carouselContent: {
    paddingRight: 4,
    alignItems: "stretch",
  },
  card: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#0f172a",
  },
  /** Preenche o quadrado do card; flex:1 estica até à altura do Pressable. */
  cardImageBg: {
    flex: 1,
    width: "100%",
  },
  cardGradient: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 10,
    paddingTop: 24,
  },
  cardLabelOverlay: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(37, 99, 235, 0.92)",
    borderRadius: 999,
    padding: 2,
  },
});
