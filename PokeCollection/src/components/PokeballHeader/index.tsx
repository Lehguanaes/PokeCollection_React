import { View } from "react-native";
import { styles } from "./styles";

export function PokeballHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.topHalf} />
      <View style={styles.middleLine} />
      <View style={styles.circle} />
    </View>
  );
}