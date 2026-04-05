import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_CHAT_THREADS } from "../data/mock";

export function ChatScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="border-b border-slate-100 px-4 py-3">
        <Text className="text-xl font-bold text-slate-900">Conversas</Text>
        <Text className="text-sm text-slate-500">
          Após o match — dados mockados
        </Text>
      </View>
      <FlatList
        data={MOCK_CHAT_THREADS}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-8"
        renderItem={({ item }) => (
          <Pressable className="flex-row items-center border-b border-slate-50 px-4 py-4 active:bg-slate-50">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <Text className="text-lg font-semibold text-rose-700">
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
              <View className="ml-2 min-w-[22px] items-center rounded-full bg-rose-500 px-1.5 py-0.5">
                <Text className="text-xs font-bold text-white">{item.unread}</Text>
              </View>
            ) : null}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
