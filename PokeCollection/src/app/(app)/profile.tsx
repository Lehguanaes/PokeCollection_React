import React, { useEffect, useState } from 'react';
import { View,  Text, StyleSheet, Platform, Image, ScrollView, useWindowDimensions } from 'react-native';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PokeballLoading } from '@/components/pokeballLoading';
import { BackgroundPokemons } from '@/components/backgroundPokemons';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

const isWeb = Platform.OS === 'web';

const XP_TOTAL = 100;
const XP_ATUAL = 12;

export default function Perfil() {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const { width } = useWindowDimensions();

    const isMobile = width < 768;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1800);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <PokeballLoading />;
    }

    return (
        <View style={styles.wrapper}>
            <BackgroundPokemons />

            <Header />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>
                    Perfil do {user}!
                </Text>

                <View style={styles.line} />

                <Text style={styles.subtitle}>
                    Veja seus status e progresso! ✨
                </Text>

                <View style={styles.content}>

                    <View
                        style={[
                            styles.card,
                            {
                                flexDirection: isMobile
                                    ? 'column'
                                    : 'row',
                            },
                        ]}
                    >

                        {/* ESQUERDA */}
                        <View
                            style={[
                                styles.leftSection,
                                isMobile && {
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 15,
                                },
                            ]}
                        >
                        <View style={styles.profileContent}>

                            <View style={styles.glow} />

                            <View style={styles.avatarWrapper}>

                                <Image
                                    source={require('../../../assets/images/icon.png')}
                                    style={styles.avatar}
                                />

                            </View>

                            <Text style={styles.name}>
                                {user}
                            </Text>

                            <Text style={styles.role}>
                                Caçador de Pokémons
                            </Text>

                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    ⭐ Nível 12
                                </Text>
                            </View>

                        </View>
                    </View>
                        {/* DIREITA */}
                        <View
                            style={[
                                styles.rightSection,
                                isMobile && {
                                    borderLeftWidth: 0,
                                    paddingLeft: 0,
                                    paddingTop: 10,
                                },
                            ]}
                        >

                            {/* XP */}
                            <View style={styles.statHeader}>

                                <Text style={styles.statTitle}>
                                    Experiência
                                </Text>

                                <Text style={styles.statValue}>
                                    {XP_ATUAL}/{XP_TOTAL}
                                </Text>

                            </View>

                            <View style={styles.xpBarTrack}>

                                <View
                                    style={[
                                        styles.xpBarFill,
                                        {
                                            width: `${(XP_ATUAL / XP_TOTAL) * 100}%` as any,
                                        },
                                    ]}
                                />

                            </View>

                            <Text style={styles.xpText}>
                                Faltam {XP_TOTAL - XP_ATUAL} XP para o próximo nível
                            </Text>

                            <View style={styles.statDivider} />

                            {/* GRID */}
                            <View style={styles.grid}>

                                <View style={styles.gridCard}>

                                    <Text style={styles.gridEmoji}>
                                        🏆
                                    </Text>

                                    <Text style={styles.gridNumber}>
                                        8
                                    </Text>

                                    <Text style={styles.gridLabel}>
                                        Vitórias
                                    </Text>

                                </View>

                                <View style={styles.gridCard}>

                                    <Text style={styles.gridEmoji}>
                                        💀
                                    </Text>

                                    <Text style={styles.gridNumber}>
                                        2
                                    </Text>

                                    <Text style={styles.gridLabel}>
                                        Derrotas
                                    </Text>

                                </View>

                                <View style={styles.gridCard}>

                                    <Text style={styles.gridEmoji}>
                                        ⚡
                                    </Text>

                                    <Text style={styles.gridNumber}>
                                        151
                                    </Text>

                                    <Text style={styles.gridLabel}>
                                        Pokémons
                                    </Text>

                                </View>

                                <View style={styles.gridCard}>

                                    <Text style={styles.gridEmoji}>
                                        🔥
                                    </Text>

                                    <Text style={styles.gridNumber}>
                                        78%
                                    </Text>

                                    <Text style={styles.gridLabel}>
                                        Progresso
                                    </Text>

                                </View>

                            </View>

                        </View>

                    </View>

                </View>

            </ScrollView>

            <Footer />

        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    scrollContent: {
        paddingBottom: 10,
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
    },

    title: {
        fontSize: 36,
        fontWeight: '900',
        color: Colors.title,
        textAlign: 'center',
        marginTop: 28,
    },

    subtitle: {
        fontSize: 18,
        color: Colors.subtitle,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    line: {
        width: 360,
        height: 5,
        backgroundColor: Colors.text,
        alignSelf: 'center',
        marginVertical: 14,
        borderRadius: 20,
    },

    /* CARD */

    card: {
        width: '100%',
        maxWidth: 1000,

        backgroundColor: Colors.white,

        borderRadius: 40,

        paddingVertical: 30,
        paddingHorizontal: 30,

        borderWidth: 2,
        borderColor: Colors.inputBorder,

        shadowColor: Colors.black,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 10,
        },

        elevation: 15,

        gap: 40,

        position: 'relative',
        overflow: 'hidden',
    },

    /* ESQUERDA */

    leftSection: {
        width: isWeb ? 280 : '100%',

        alignItems: 'center',
        justifyContent: 'center',

        position: 'relative',
    },
    
    profileContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
    },

    glow: {
        position: 'absolute',

        width: 240,
        height: 240,

        borderRadius: 999,

        backgroundColor: Colors.secondary,

        opacity: 0.18,

        top: -20,

        zIndex: 0,
    },

    avatarWrapper: {
        width: 200,
        height: 200,

        position: 'relative',

        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 999,

        backgroundColor: Colors.white,

        borderWidth: 4,
        borderColor: Colors.details,

        overflow: 'visible',

        zIndex: 2,

        shadowColor: Colors.details,
        shadowOpacity: 0.35,
        shadowRadius: 15,
        shadowOffset: {
            width: 0,
            height: 6,
        },

        elevation: 12,
    },

    avatar: {
        width: 160,
        height: 160,
    },

    /* TEXTOS */

    name: {
        fontSize: isWeb ? 34 : 28,
        fontWeight: '900',
        color: Colors.title,
        marginTop: 22,
        textAlign: 'center',
    },

    role: {
        fontSize: 14,
        color: Colors.subtitle,
        fontWeight: '700',
        marginTop: 8,
        letterSpacing: 1,
        textTransform: 'uppercase',
        textAlign: 'center',
    },

    badge: {
        marginTop: 18,

        backgroundColor: Colors.details,

        paddingHorizontal: 20,
        paddingVertical: 10,

        borderRadius: 999,
    },

    badgeText: {
        color: Colors.gray[800],
        fontWeight: '800',
        fontSize: 14,
    },

    /* DIREITA */

    rightSection: {
        flex: 1,
        justifyContent: 'center',
    },

    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    statTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: Colors.title,
    },

    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: Colors.subtitle,
    },

    xpBarTrack: {
        width: '100%',
        height: 16,

        backgroundColor: Colors.inputBorder,

        borderRadius: 999,

        overflow: 'hidden',

        marginTop: 14,
    },

    xpBarFill: {
        height: '100%',
        backgroundColor: Colors.details,
        borderRadius: 999,
    },

    xpText: {
        fontSize: 14,
        color: Colors.subtitle,
        fontWeight: '600',
        marginTop: 10,
    },

    statDivider: {
        width: '100%',
        height: 2,
        backgroundColor: Colors.inputBorder,
        marginVertical: 20,
    },

    /* GRID */

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 18,
    },

    gridCard: {
        width: isWeb ? '47%' : '100%',

        backgroundColor: Colors.white,

        borderRadius: 24,

        paddingVertical: 28,
        paddingHorizontal: 16,

        alignItems: 'center',

        borderWidth: 1,
        borderColor: Colors.inputBorder,

        shadowColor: Colors.black,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 4,
    },

    gridEmoji: {
        fontSize: 32,
        marginBottom: 12,
    },

    gridNumber: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.title,
    },

    gridLabel: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.subtitle,
        fontWeight: '700',
    },
});