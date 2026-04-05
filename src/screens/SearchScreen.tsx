import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import type { RootTabParamList } from "../navigation/types";
import {
  filterProfessionals,
  MOCK_PROFESSIONALS,
  TAGS_SERVICOS_POPULARES,
  type ProfissaoSlug,
} from "../data/mock";

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<ProfissaoSlug | null>(null);

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  const isCliente = user?.role === "cliente";

  const resultadoDeck = useMemo(
    () =>
      filterProfessionals(MOCK_PROFESSIONALS, {
        profissao: tag,
        query: query.trim() || null,
      }),
    [query, tag],
  );

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
            ? "Escolha uma tag ou pesquise e abra o Descobrir para ver os cards."
            : "Filtre por tipo de serviço ou texto — o Descobrir mostra profissionais nesse critério."}
        </Text>
        <View className="mt-3 flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
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
          className="mt-3 flex-row items-center justify-center rounded-xl bg-blue-600 py-3 active:bg-blue-700"
        >
          <Ionicons name="flame" size={20} color="#fff" />
          <Text className="ml-2 text-base font-semibold text-white">
            Ver no Descobrir (match)
          </Text>
        </Pressable>

        <Text className="mt-2 text-center text-xs text-slate-400">
          Com o filtro atual: {resultadoDeck.length}{" "}
          {resultadoDeck.length === 1 ? "profissional" : "profissionais"} no deck
        </Text>
      </View>

      <View style={padH} className="flex-1 bg-white pb-4 pt-3">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Serviços mais procurados — toque para abrir o Descobrir
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-2 pb-1"
        >
          {TAGS_SERVICOS_POPULARES.map(({ slug, label }) => {
            const active = tag === slug;
            return (
              <Pressable
                key={slug}
                onPress={() => aoEscolherTag(slug)}
                className={`rounded-full border px-3 py-2 ${
                  active
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-200 bg-slate-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    active ? "text-white" : "text-slate-700"
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text className="mt-6 text-center text-sm leading-5 text-slate-500">
          Ao tocar numa tag, vai direto ao Descobrir com essa profissão. Use a
          caixa de texto e &quot;Ver no Descobrir&quot; para combinar palavra-chave
          e, opcionalmente, a última tag selecionada.
        </Text>
      </View>
    </SafeAreaView>
  );
}
