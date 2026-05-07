import { View, StyleSheet, ScrollView } from "react-native";
import { LoginCard } from "@/components/LoginCard";
import { PokeballHeader } from "@/components/PokeballHeader";
import { Footer } from "@/components/footer";
import { Colors } from "../../constants/colors";

export default function App() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <PokeballHeader />

      <View style={styles.content}>
        <LoginCard />
      </View>

      <Footer />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});