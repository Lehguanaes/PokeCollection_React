import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',

    // 🖱️ transição suave (web)
    transitionDuration: '200ms',
  },

  text: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,

    // 🖱️ transição no texto
    transitionDuration: '200ms',
  },

  // 🖱️ HOVER
  hover: {
    backgroundColor: Colors.details,
    transform: [{ scale: 1.05 }],
  },

  textHover: {
    color: '#000', // 🔥 texto fica preto
  },

  // 👆 CLICK
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});