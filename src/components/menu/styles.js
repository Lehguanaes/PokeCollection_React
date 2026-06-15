import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 120,
    right: 32,
    zIndex: 999,
    alignItems: 'center',
  },

mobileWrapper: {
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  zIndex: 999,
},

mobileDropdownContainer: {
  position: 'absolute',
  top: 62,
  left: 16,
  right: 16,
  zIndex: 1,
},

  dropdownContainer: {
    position: 'absolute',
    top: 72,
    right: -10,
    width: 260,
    zIndex: 1,
  },

  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: 34,
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 3,
    borderColor: Colors.details,
    shadowColor: Colors.details,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 15,
    overflow: 'hidden',
  },

  mobileDropdown: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    gap: 6,
    borderWidth: 3,
    borderColor: Colors.details,
    shadowColor: Colors.details,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 15,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
  },

  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
  },

  activeItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.pokeballRed,
    marginRight: 14,
    shadowColor: Colors.pokeballRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  mobileIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.pokeballRed,
    marginRight: 10,
    shadowColor: Colors.pokeballRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },

  activeIcon: {
    backgroundColor: Colors.white,
  },

  textContainer: {
    flex: 1,
  },

  menuText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.txtPrimary,
  },

  mobileMenuText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.txtPrimary,
  },

  activeText: {
    color: Colors.white,
  },

  glowWrapper: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  mobileGlowWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  glow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: 'rgba(102,205,170,0.28)',
  },

  mobileGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: 'rgba(102,205,170,0.28)',
  },

  pokeball: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mobilePokeball: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ballInner: {
    width: 70,
    height: 70,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.black,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 14,
  },

  mobileBallInner: {
    width: 52,
    height: 52,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.black,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 12,
  },

  topHalf: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '50%',
    backgroundColor: Colors.pokeballRed,
  },

  bottomHalf: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    backgroundColor: Colors.white,
  },

  middleLine: {
    position: 'absolute',
    top: '47%',
    width: '100%',
    height: 6,
    backgroundColor: Colors.black,
    zIndex: 3,
  },

  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.black,
    zIndex: 5,
  },

  innerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: 8,
    marginLeft: -4,
    marginTop: -4,
    borderRadius: 999,
    backgroundColor: Colors.white,
    zIndex: 6,
  },
});