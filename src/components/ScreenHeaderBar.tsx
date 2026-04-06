import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { STACK_HEADER_ACCENT } from "../navigation/stackHeader";

type Props = {
  title: string;
  onBack: () => void;
};

/**
 * Barra de topo fora do header nativo — evita o círculo branco do `UIBarButtonItem` no iOS.
 */
export function ScreenHeaderBar({ title, onBack }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View
        style={[
          styles.row,
          { paddingLeft: 8 + insets.left, paddingRight: 16 + insets.right },
        ]}
      >
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          android_ripple={null}
          style={({ pressed }) => [
            styles.backHit,
            { opacity: pressed ? 0.65 : 1 },
          ]}
        >
          <Feather name="arrow-left" size={22} color={STACK_HEADER_ACCENT} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#ffffff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
  },
  backHit: {
    justifyContent: "center",
  },
  title: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "right",
  },
});
