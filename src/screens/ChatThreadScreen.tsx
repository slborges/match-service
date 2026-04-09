import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import type { ChatStackParamList } from "../navigation/types";

type Msg = { id: string; fromMe: boolean; text: string; time: string };

function seedMessages(threadId: string, threadName: string): Msg[] {
  return [
    {
      id: `${threadId}-1`,
      fromMe: false,
      text: `Olá! Aqui é ${threadName}.`,
      time: "09:12",
    },
    {
      id: `${threadId}-2`,
      fromMe: true,
      text: "Perfeito, vamos alinhar os detalhes da demanda.",
      time: "09:14",
    },
  ];
}

export function ChatThreadScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<ChatStackParamList, "ConversaDetalhe">>();
  const { threadId, threadName } = route.params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(() =>
    seedMessages(threadId, threadName),
  );

  const listData = useMemo(() => [...messages].reverse(), [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `${threadId}-${Date.now()}`,
        fromMe: true,
        text,
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text className="text-lg font-bold text-slate-900">{threadName}</Text>
          <Text className="text-xs text-slate-500">Conversa da demanda</Text>
        </View>

        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 10, paddingTop: 10 + insets.top * 0.1 },
          ]}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubbleWrap,
                item.fromMe ? styles.meWrap : styles.otherWrap,
              ]}
            >
              <View style={[styles.bubble, item.fromMe ? styles.me : styles.other]}>
                <Text
                  style={[styles.bubbleText, item.fromMe ? styles.meText : styles.otherText]}
                >
                  {item.text}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          )}
        />

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#94a3b8"
            className="flex-1 rounded-[8px] border border-slate-200 bg-white px-3 py-3 text-base text-slate-900"
            multiline
          />
          <Pressable
            onPress={send}
            className="ml-2 rounded-[8px] bg-blue-600 px-4 py-3 active:bg-blue-700"
          >
            <Text className="font-semibold text-white">Enviar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  listContent: {
    paddingHorizontal: 12,
  },
  bubbleWrap: {
    marginVertical: 5,
    flexDirection: "row",
  },
  meWrap: {
    justifyContent: "flex-end",
  },
  otherWrap: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  me: {
    backgroundColor: "#2563eb",
    borderBottomRightRadius: 0,
  },
  other: {
    backgroundColor: "#e2e8f0",
    borderBottomLeftRadius: 0,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  meText: {
    color: "#fff",
  },
  otherText: {
    color: "#0f172a",
  },
  timeText: {
    marginTop: 4,
    fontSize: 11,
    color: "rgba(15,23,42,0.55)",
    textAlign: "right",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: "#f8fafc",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#cbd5e1",
  },
});

