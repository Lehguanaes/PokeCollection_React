import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 620,
    padding: 24,
    borderRadius: 26,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    alignSelf: "center",
  },

  cardMobile: {
    marginTop: 5,
  },

  cardDesktop: {
    marginTop: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.title,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: Colors.subtitle,
    marginBottom: 16,
    textAlign: "center",
  },

  line: {
    width: 200,
    height: 5,
    backgroundColor: Colors.secondary,
    alignSelf: "center",
    marginVertical: 12,
    borderRadius: 3,
  },

  bodyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  inputArea: {
    flex: 1,
    marginLeft: 20,
  },

  inputColumn: {
    width: "100%",
  },

  avatarCenter: {
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 160,
    height: 160,
  },
});