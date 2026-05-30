import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const RED_HEIGHT = 33;
const RED_HEIGHT_MOBILE = 44;
const LINE_HEIGHT = 6;
const LINE_HEIGHT_MOBILE = 5;
const CONTAINER_HEIGHT = 72;
const CONTAINER_HEIGHT_MOBILE = 78;

export const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 999,
  },
  containerMobile: {
    height: CONTAINER_HEIGHT_MOBILE,
    justifyContent: 'flex-end',  
    paddingBottom: 6,            
  },

  topHalf: {
    position: 'absolute',
    top: 0,
    height: RED_HEIGHT,
    width: '100%',
    backgroundColor: Colors.pokeballRed,
  },
  topHalfMobile: {
    height: RED_HEIGHT_MOBILE,
  },

  middleLine: {
    position: 'absolute',
    top: RED_HEIGHT,
    height: LINE_HEIGHT,
    width: '100%',
    backgroundColor: Colors.black,
  },
  middleLineMobile: {
    top: RED_HEIGHT_MOBILE,
    height: LINE_HEIGHT_MOBILE,
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