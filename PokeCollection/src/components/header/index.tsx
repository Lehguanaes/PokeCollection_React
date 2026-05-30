import { View, useWindowDimensions } from "react-native";
import { styles } from "./styles";
import { Menu } from "@/components/menu";

type HeaderProps = {
  showMenu?: boolean;
};

export function Header({ showMenu = true }: HeaderProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      <View style={styles.topHalf} />
      <View style={styles.middleLine} />

      {isMobile && showMenu ? (
        <Menu />
      ) : (
        <View style={styles.circle} />
      )}
    </View>
  );
}