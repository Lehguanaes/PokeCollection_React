import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    transitionDuration: '200ms',
  },

  text: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    transitionDuration: '200ms',
  },

  hover: {
    backgroundColor: Colors.details,
    transform: [{ scale: 1.05 }],
  },

  textHover: {
    color: '#000',
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});