import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        paddingBottom: 0,
    },

    content: {
        paddingHorizontal: 20,
        gap: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.title,
        textAlign: 'center',
        marginTop: 10,
    },

    subtitle: {
        fontSize: 18,
        color: Colors.subtitle,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    line: {
        width: 200,
        height: 5,
        backgroundColor: Colors.text,
        alignSelf: "center",
        marginVertical: 2,
        borderRadius: 3,
    },

    logoutButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        width: 180,
        borderRadius: 10,
        alignItems: 'center',
    },

    logoutText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 30,
        width: '100%',
    },

    buttonHover: {
        backgroundColor: Colors.pokeballRed,
        transform: [{ scale: 1.05 }],
    },

    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.97 }],
    },

    pokemon1: {
        position: 'absolute',
        top: 160,
        left: 40,
        width: 150,
        height: 150,
    },

    pokemon2: {
        position: 'absolute',
        top: 260,
        right: 40,
        width: 160,
        height: 160,
    },

    pokemon3: {
        position: 'absolute',
        top: 490,
        left: 30,
        width: 160,
        height: 160,
    },

    pokemon4: {
        position: 'absolute',
        top: 700,
        right: 30,
        width: 160,
        height: 160,
    },
});