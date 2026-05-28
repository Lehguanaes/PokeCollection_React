import { View, useWindowDimensions } from "react-native";
import { styles } from "./styles";
import { Menu } from "@/components/menu";

export function Header() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      <View style={styles.topHalf} />
      <View style={styles.middleLine} />

      {isMobile ? (
        // No mobile, a pokébola do Menu substitui o círculo estático
        <Menu />
      ) : (
        <View style={styles.circle} />
      )}
    </View>
  );
}