import { Platform, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { Menu } from "@/components/menu";

type HeaderProps = {
  showMenu?: boolean;
};

export function Header({ showMenu = true }: HeaderProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 560;
  const topInset =
    isMobile && Platform.OS === 'android'
      ? Math.max(insets.top, 24)
      : 0;
  const mobileRedHeight = 44 + topInset;
  const mobileContainerHeight = 78 + topInset;

  return (
    <View
      style={[
        styles.container,
        isMobile && styles.containerMobile,
        isMobile && { height: mobileContainerHeight },
      ]}
    >
      <View
        style={[
          styles.topHalf,
          isMobile && styles.topHalfMobile,
          isMobile && { height: mobileRedHeight },
        ]}
      />
      <View
        style={[
          styles.middleLine,
          isMobile && styles.middleLineMobile,
          isMobile && { top: mobileRedHeight },
        ]}
      />

      {isMobile && showMenu ? (
        <Menu />
      ) : (
        <View style={styles.circle} />
      )}
    </View>
  );
}
