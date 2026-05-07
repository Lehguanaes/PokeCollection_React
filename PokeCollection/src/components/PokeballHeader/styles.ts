import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHalf: {
    position: 'absolute',
    top: 0,
    height: 33,
    width: '100%',
    backgroundColor: Colors.pokeballRed,
  },
  middleLine: {
    position: 'absolute',
    top: 33,
    height: 8,
    width: '100%',
    backgroundColor: Colors.black,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    borderWidth: 5,
    borderColor: Colors.black,
  },
});