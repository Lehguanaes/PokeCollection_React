import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    gap: 15,
    margin: 12,

    // Sombra multiplataforma
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 10px 20px rgba(0,0,0,0.12)',
        }
      : {
          shadowColor: Colors.text,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 14,
          elevation: 8,
        }),
  },

  imageContainer: {
    width: 170,
    height: 170,
    borderRadius: 80,
    backgroundColor: Colors.imageBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 100,
    height: 100,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.subtitle,
  },

  description: {
    fontSize: 13,
    color: Colors.text,
    textAlign: 'center',
  },

  button: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: Colors.details,
    borderWidth: 1,
    borderColor: Colors.subtitle,

    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 0px 12px rgba(255, 200, 0, 0.6)',
        }
      : {
          shadowColor: Colors.details,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 10,
          elevation: 6,
        }),
  },

  buttonText: {
    color: Colors.label,
    fontSize: 13,
    fontWeight: 'bold',
  },
});