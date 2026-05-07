import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.white,
  },

  carouselContainer: {
    height: 75,
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pokemon: {
    width: 65,
    height: 65,
    marginHorizontal: 4,
    marginTop: 8,
  },

  bottomBar: {
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  copy: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '90%', 
  },
});