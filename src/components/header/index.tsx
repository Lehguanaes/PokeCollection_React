import { View, useWindowDimensions } from "react-native";
import { styles } from "./styles";
import { Menu } from "@/components/menu";

type HeaderProps = {
  showMenu?: boolean;
};

export function Header({ showMenu = true }: HeaderProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 560;

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={[styles.topHalf, isMobile && styles.topHalfMobile]} />
      <View style={[styles.middleLine, isMobile && styles.middleLineMobile]} />

      {isMobile && showMenu ? (
        <Menu />
      ) : (
        <View style={styles.circle} />
      )}
    </View>
  );
}