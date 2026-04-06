import { Feather } from "@expo/vector-icons";
import type { ReactElement } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

/** Mesma cor da seta do ecrã Cadastro. */
export const STACK_HEADER_ACCENT = "#2563eb";

const headerTitleStyle = {
  fontSize: 17,
  fontWeight: "700" as const,
  color: "#0f172a",
};

const styles = StyleSheet.create({
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
});

type NavWithBack = { goBack: () => void };

/** Seta voltar estilo Cadastro (Feather `arrow-left`, azul) dentro de círculo branco com sombra leve. */
export function StackBackButton({
  onPress,
  testID,
}: {
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      android_ripple={null}
      style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
    >
      <View style={styles.backCircle}>
        <Feather name="arrow-left" size={22} color={STACK_HEADER_ACCENT} />
      </View>
    </Pressable>
  );
}

/**
 * Header padronizado: título centrado, seta azul em círculo branco (como «Os meus pedidos»).
 * No iOS usa `unstable_headerLeftItems` para evitar o “pill” branco do sistema.
 */
export function stackHeaderOptions(
  navigation: NavWithBack,
  title: string,
): NativeStackNavigationOptions {
  const goBack = () => navigation.goBack();

  const headerLeftJsx = <StackBackButton onPress={goBack} />;

  const base: NativeStackNavigationOptions = {
    title,
    headerTitleAlign: "center",
    headerTitleStyle: headerTitleStyle,
    headerTintColor: STACK_HEADER_ACCENT,
    headerStyle: {
      backgroundColor: "#ffffff",
    },
    headerShadowVisible: true,
    headerRight: () => null,
  };

  if (Platform.OS === "ios") {
    return {
      ...base,
      unstable_headerLeftItems: () => [
        {
          type: "custom",
          element: headerLeftJsx as ReactElement,
          hidesSharedBackground: true,
        },
      ],
    };
  }

  return {
    ...base,
    headerLeft: () => headerLeftJsx,
  };
}
