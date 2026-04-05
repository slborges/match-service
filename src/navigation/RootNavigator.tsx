import { useAuth } from "../context/AuthContext";
import { AuthStack } from "./AuthStack";
import { RootTabs } from "./RootTabs";

export function RootNavigator() {
  const { user } = useAuth();

  if (user) {
    return <RootTabs />;
  }

  return <AuthStack />;
}
