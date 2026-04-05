import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import {
  LABEL_PROFISSAO,
  MOCK_DEMANDAS,
  MOCK_PROFESSIONALS,
  TAGS_SERVICOS_POPULARES,
  type DemandaServico,
  type ProfissaoSlug,
  type Professional,
} from "../data/mock";

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<ProfissaoSlug | null>(null);

  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  const isCliente = user?.role === "cliente";

  const profissionaisFiltrados = useMemo(() => {
    let list = [...MOCK_PROFESSIONALS];
    if (tag) {
      list = list.filter((p) => p.profissao === tag);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.service.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          LABEL_PROFISSAO[p.profissao].toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, tag]);

  const demandasFiltradas = useMemo(() => {
    let list = [...MOCK_DEMANDAS];
    if (tag) {
      list = list.filter((d) => d.profissao === tag);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (d) =>
          d.titulo.toLowerCase().includes(q) ||
          d.resumo.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          LABEL_PROFISSAO[d.profissao].toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, tag]);

  const toggleTag = (slug: ProfissaoSlug) => {
    setTag((prev) => (prev === slug ? null : slug));
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View style={padH} className="border-b border-slate-100 bg-white pb-3 pt-2">
        <Text className="text-xl font-bold text-slate-900">Buscar</Text>
        <Text className="mt-0.5 text-sm text-slate-500">
          {isCliente
            ? "Encontre profissionais por nome, serviço ou área."
            : "Encontre pedidos por tipo de serviço ou palavra-chave."}
        </Text>
        <View className="mt-3 flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={
              isCliente
                ? "Ex.: eletricista, Pinheiros, Maria…"
                : "Ex.: vazamento, pintura, orçamento…"
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
      </View>

      <View style={padH} className="bg-white pb-2 pt-3">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Serviços mais procurados
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
                onPress={() => toggleTag(slug)}
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
      </View>

      {isCliente ? (
        <FlatList
          data={profissionaisFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[padH, { paddingBottom: 24, paddingTop: 12 }]}
          ListEmptyComponent={
            <Text className="py-8 text-center text-slate-500">
              Nenhum profissional encontrado. Tente outra palavra ou tag.
            </Text>
          }
          renderItem={({ item }) => (
            <ClienteResultCard professional={item} />
          )}
        />
      ) : (
        <FlatList
          data={demandasFiltradas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[padH, { paddingBottom: 24, paddingTop: 12 }]}
          ListEmptyComponent={
            <Text className="py-8 text-center text-slate-500">
              Nenhum pedido encontrado. Ajuste a busca ou a tag.
            </Text>
          }
          renderItem={({ item }) => <DemandaCard demanda={item} />}
        />
      )}
    </SafeAreaView>
  );
}

function ClienteResultCard({ professional }: { professional: Professional }) {
  return (
    <View className="mb-3 flex-row overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
      <Image
        source={{ uri: professional.imageUrl }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View className="min-w-0 flex-1 pl-3">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="flex-1 font-semibold text-slate-900" numberOfLines={1}>
            {professional.name}
          </Text>
          <Text className="text-xs text-amber-600">
            ★ {professional.rating.toFixed(1)}
          </Text>
        </View>
        <Text className="mt-0.5 text-xs font-medium text-blue-600">
          {LABEL_PROFISSAO[professional.profissao]}
        </Text>
        <Text className="mt-0.5 text-sm text-slate-600" numberOfLines={2}>
          {professional.service}
        </Text>
        <Text className="mt-1 text-xs text-slate-400" numberOfLines={1}>
          {professional.city} · {professional.priceLabel}
        </Text>
      </View>
    </View>
  );
}

function DemandaCard({ demanda }: { demanda: DemandaServico }) {
  return (
    <View className="mb-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-2">
        <Text className="min-w-0 flex-1 text-base font-semibold text-slate-900">
          {demanda.titulo}
        </Text>
        <View className="rounded-full bg-blue-50 px-2 py-0.5">
          <Text className="text-xs font-medium text-blue-700">
            {LABEL_PROFISSAO[demanda.profissao]}
          </Text>
        </View>
      </View>
      <Text className="mt-2 text-sm leading-5 text-slate-600">{demanda.resumo}</Text>
      <View className="mt-3 flex-row flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3">
        <Text className="text-sm font-medium text-slate-800">
          {demanda.orcamentoLabel}
        </Text>
        <Text className="text-xs text-slate-400">{demanda.publicadoEm}</Text>
      </View>
      <Text className="mt-1 text-xs text-slate-500">📍 {demanda.city}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
  },
});
