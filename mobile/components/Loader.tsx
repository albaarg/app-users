import { View, ActivityIndicator } from "react-native";
import COLORS from "@/constants/colors";

type LoaderProps = {
  size?: "small" | "large";
};

export default function Loader({ size = "large" }: LoaderProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size={size} color={COLORS.primary} />
    </View>
  );
}
