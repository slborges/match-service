import { useRoute } from "@react-navigation/native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import type { RootTabParamList } from "../navigation/types";
import type { RouteProp } from "@react-navigation/native";

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootTabParamList, "Conversas">>();
  const { chatThreads } = useAuth();
  const highlightThreadId = route.params?.highlightThreadId;
  const padH = {
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View style={[padH, styles.header]}>
        <Text className="text-xl font-bold text-slate-900">Conversas</Text>
        <Text className="text-sm text-slate-500">
          Após o match — dados mockados
        </Text>
      </View>
      <FlatList
        data={chatThreads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={[
              padH,
              styles.row,
              item.id === highlightThreadId ? styles.highlightRow : null,
              item.unread > 0 ? styles.unreadRow : null,
            ]}
            className="flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-lg font-semibold text-blue-700">
                {item.name.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-slate-900">{item.name}</Text>
                <Text className="text-xs text-slate-400">{item.timeLabel}</Text>
              </View>
              <Text className="mt-0.5 text-sm text-slate-500" numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unread > 0 ? (
              <View className="ml-2 min-w-[22px] items-center rounded-full bg-blue-600 px-1.5 py-0.5">
                <Text className="text-xs font-bold text-white">{item.unread}</Text>
              </View>
            ) : null}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 12,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 32,
  },
  row: {
    paddingBottom: 16,
    paddingTop: 16,
  },
  highlightRow: {
    backgroundColor: "#dbeafe",
  },
  unreadRow: {
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
  },
});
