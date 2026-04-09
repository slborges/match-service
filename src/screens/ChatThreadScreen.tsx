import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
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

import { useAuth } from "../context/AuthContext";
import type { ChatStackParamList } from "../navigation/types";
import { iniciaisNomeSobrenome } from "../utils/iniciaisNomeSobrenome";

/** Azul alinhado a `bg-blue-600` / `#2563eb` no resto da app. */
const THEME = {
  screenBg: "#F5F5F7",
  surface: "#FFFFFF",
  incomingBubble: "#E9E9EB",
  incomingText: "#1C1C1E",
  outgoingBubble: "#2563eb",
  outgoingText: "#FFFFFF",
  border: "#E5E5EA",
  inputBg: "#F2F2F7",
  muted: "#8E8E93",
  brandBlue: "#2563eb",
  quoteBar: "#2563eb",
  shadow: "rgba(0,0,0,0.08)",
};

type Reaction = { emoji: string; mine?: boolean };

type Msg = {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  senderName?: string;
  quote?: { author: string; text: string };
  reactions?: Reaction[];
};

function seedMessages(threadId: string, threadName: string, myName: string): Msg[] {
  return [
    {
      id: `${threadId}-1`,
      fromMe: false,
      senderName: threadName,
      text: `Olá! Aqui é ${threadName}. Podemos combinar os detalhes por aqui?`,
      time: "09:12",
      reactions: [{ emoji: "👍", mine: true }],
    },
    {
      id: `${threadId}-2`,
      fromMe: false,
      senderName: threadName,
      quote: {
        author: myName,
        text: "Preciso de um orçamento ainda esta semana.",
      },
      text: "Consigo sim — te envio ainda hoje com valores e prazo.",
      time: "09:13",
    },
    {
      id: `${threadId}-3`,
      fromMe: true,
      text: "Perfeito, vamos alinhar os detalhes da demanda.",
      time: "09:14",
    },
  ];
}

function AvatarCircle({
  label,
  size,
  backgroundColor,
}: {
  label: string;
  size: number;
  backgroundColor: string;
}) {
  const fontSize = size * 0.38;
  return (
    <View
      style={[
        styles.avatarCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
      accessibilityLabel={label}
    >
      <Text style={{ color: "#fff", fontWeight: "700", fontSize }}>
        {iniciaisNomeSobrenome(label)}
      </Text>
    </View>
  );
}

export function ChatThreadScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const route = useRoute<RouteProp<ChatStackParamList, "ConversaDetalhe">>();
  const { user, marcarConversaLida } = useAuth();
  const { threadId, threadName } = route.params;

  const myName = user?.name ?? "Você";

  useFocusEffect(
    useCallback(() => {
      marcarConversaLida(threadId);
    }, [threadId, marcarConversaLida]),
  );

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(() =>
    seedMessages(threadId, threadName, myName),
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

  const renderBubble = (item: Msg) => {
    const isMe = item.fromMe;

    const bubbleInner = (
      <>
        {!isMe && item.quote ? (
          <View style={styles.quoteBox}>
            <View style={styles.quoteBar} />
            <View style={styles.quoteTextCol}>
              <Text style={styles.quoteAuthor}>{item.quote.author}</Text>
              <Text style={styles.quoteSnippet} numberOfLines={3}>
                {item.quote.text}
              </Text>
            </View>
          </View>
        ) : null}
        <Text
          style={[
            styles.bubbleBody,
            isMe ? styles.textMe : styles.textOther,
          ]}
        >
          {item.text}
        </Text>
        <View style={[styles.metaRow, isMe ? styles.metaRowMe : styles.metaRowOther]}>
          <Text style={isMe ? styles.timeMe : styles.timeOther}>{item.time}</Text>
          {isMe ? (
            <Ionicons
              name="checkmark"
              size={15}
              color="rgba(255,255,255,0.92)"
              style={{ marginLeft: 4 }}
            />
          ) : null}
        </View>
      </>
    );

    if (isMe) {
      return (
        <View style={[styles.row, styles.rowMe]}>
          <View style={[styles.bubble, styles.bubbleMe, styles.bubbleShadow]}>
            {bubbleInner}
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.row, styles.rowOther]}>
        <View style={styles.otherContent}>
          {item.senderName ? (
            <Text style={styles.senderName}>{item.senderName}</Text>
          ) : null}
          <View style={[styles.bubble, styles.bubbleOther, styles.bubbleShadow]}>
            {bubbleInner}
          </View>
          {item.reactions && item.reactions.length > 0 ? (
            <View style={styles.reactionsRow}>
              {item.reactions.map((r, i) => (
                <View
                  key={`${item.id}-r-${i}`}
                  style={[styles.reactionChip, r.mine && styles.reactionChipMine]}
                >
                  <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                </View>
              ))}
              <Pressable
                hitSlop={8}
                style={styles.reactionAdd}
                accessibilityLabel="Adicionar reação"
              >
                <Ionicons name="happy-outline" size={18} color={THEME.muted} />
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={[styles.header, { paddingTop: 8 }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={styles.headerBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={26} color={THEME.incomingText} />
          </Pressable>

          <View
            style={styles.headerContact}
            accessibilityRole="header"
            accessibilityLabel={`Conversa com ${threadName}`}
          >
            <AvatarCircle
              label={threadName}
              size={40}
              backgroundColor={THEME.brandBlue}
            />
            <Text style={styles.headerContactName} numberOfLines={1}>
              {threadName}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable hitSlop={8} style={styles.iconBtn} accessibilityLabel="Ligar">
              <Ionicons name="call-outline" size={22} color={THEME.incomingText} />
            </Pressable>
            <Pressable hitSlop={8} style={styles.iconBtn} accessibilityLabel="Mais opções">
              <Ionicons name="copy-outline" size={22} color={THEME.incomingText} />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={[
            styles.listContent,
            {
              paddingTop: 12,
              paddingBottom: 12 + insets.bottom * 0.25,
              flexGrow: 1,
              justifyContent: "flex-end",
            },
          ]}
          renderItem={({ item }) => (
            <View style={styles.messageBlock}>{renderBubble(item)}</View>
          )}
        />

        <View
          style={[
            styles.inputBar,
            {
              paddingBottom: Math.max(insets.bottom, 12),
              paddingTop: 10,
            },
          ]}
        >
          <View style={styles.inputColumn}>
            <View style={styles.inputTopRow}>
              <View style={styles.inputFieldWrap}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Digite aqui"
                  placeholderTextColor={THEME.muted}
                  style={styles.inputField}
                  multiline
                  maxLength={2000}
                />
              </View>
              <Pressable
                onPress={send}
                style={styles.sendIconBtn}
                accessibilityLabel="Enviar mensagem"
              >
                <Ionicons name="send" size={24} color={THEME.brandBlue} />
              </Pressable>
            </View>
            <View style={styles.inputIconsRow}>
              <Pressable hitSlop={8} accessibilityLabel="Emoji">
                <Ionicons name="happy-outline" size={22} color={THEME.muted} />
              </Pressable>
              <Pressable hitSlop={8} accessibilityLabel="Câmera">
                <Ionicons name="camera-outline" size={22} color={THEME.muted} />
              </Pressable>
              <Pressable hitSlop={8} accessibilityLabel="Galeria">
                <Ionicons name="image-outline" size={22} color={THEME.muted} />
              </Pressable>
              <Pressable hitSlop={8} accessibilityLabel="Mensagem de voz">
                <Ionicons name="mic-outline" size={22} color={THEME.muted} />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.screenBg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 10,
    backgroundColor: THEME.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.border,
  },
  headerBack: {
    padding: 4,
    marginRight: 4,
  },
  headerContact: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    gap: 12,
  },
  headerContactName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: THEME.incomingText,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  iconBtn: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  messageBlock: {
    marginVertical: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  rowMe: {
    justifyContent: "flex-end",
  },
  rowOther: {
    justifyContent: "flex-start",
  },
  otherContent: {
    flexShrink: 1,
    maxWidth: "82%",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.muted,
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "100%",
  },
  bubbleShadow: {
    ...Platform.select({
      ios: {
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  bubbleMe: {
    backgroundColor: THEME.outgoingBubble,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: THEME.incomingBubble,
    borderBottomLeftRadius: 4,
  },
  quoteBox: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingRight: 10,
    marginBottom: 8,
    overflow: "hidden",
  },
  quoteBar: {
    width: 3,
    backgroundColor: THEME.quoteBar,
    marginRight: 8,
    borderRadius: 2,
  },
  quoteTextCol: {
    flex: 1,
    minWidth: 0,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.brandBlue,
    marginBottom: 2,
  },
  quoteSnippet: {
    fontSize: 13,
    color: THEME.incomingText,
    opacity: 0.85,
    lineHeight: 18,
  },
  bubbleBody: {
    fontSize: 16,
    lineHeight: 22,
  },
  textMe: {
    color: THEME.outgoingText,
  },
  textOther: {
    color: THEME.incomingText,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  metaRowMe: {
    justifyContent: "flex-end",
  },
  metaRowOther: {
    justifyContent: "flex-start",
  },
  timeMe: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
  },
  timeOther: {
    fontSize: 11,
    color: THEME.muted,
  },
  reactionsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
    marginLeft: 4,
  },
  reactionChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: THEME.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.border,
  },
  reactionChipMine: {
    borderColor: THEME.brandBlue,
    borderWidth: 1.5,
  },
  reactionEmoji: {
    fontSize: 15,
  },
  reactionAdd: {
    padding: 2,
  },
  inputBar: {
    paddingHorizontal: 10,
    backgroundColor: THEME.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.border,
  },
  inputColumn: {
    width: "100%",
  },
  inputTopRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  sendIconBtn: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  inputFieldWrap: {
    flex: 1,
    minWidth: 0,
    backgroundColor: THEME.inputBg,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.border,
    paddingLeft: 14,
    paddingRight: 14,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 120,
  },
  inputField: {
    fontSize: 16,
    color: THEME.incomingText,
    maxHeight: 72,
    paddingVertical: 4,
  },
  inputIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 10,
    paddingLeft: 4,
    paddingBottom: 2,
  },
  avatarCircle: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
