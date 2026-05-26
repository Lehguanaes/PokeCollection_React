import { View } from "react-native";
import { styles } from "./styles";

// Define o componente do cabeçalho da Pokebola
export function PokeballHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.topHalf} />
      <View style={styles.middleLine} />
      <View style={styles.circle} />
    </View>
  );
}