import { StyleSheet, Platform } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.label,
    marginBottom: 6,
  },

  inputWrapper: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.inputBorder,
  },

  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.placeholder,

    borderWidth: 0,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    }),
  },
});