import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Header } from '@/components/header';
import { PokeballLoading } from '@/components/pokeballLoading';
import { List } from '@/components/list';
import { Card } from '@/components/card';
import { BackgroundPokemons } from '@/components/backgroundPokemons';
import { getPokemons } from '@/integration/pokemonIntegration';
import { Footer } from '@/components/footer';
import { Pokemon } from '@/@types/pokemon';
import { Colors } from '@/constants/colors';
import { TYPE_MAP } from '@/constants/pokemon';

const mapType = (t: string) =>
    TYPE_MAP[t] ?? 'normal';

const MY_TEAM_SIZE = 5;

const POKEDEX_SIZE = 25;

export default function Dashboard() {
    const [loading, setLoading] =
        useState(true);

    const [myTeam, setMyTeam] =
        useState<Pokemon[]>([]);

    const [
        randomPokemons,
        setRandomPokemons,
    ] = useState<Pokemon[]>([]);

    const { width } =
        useWindowDimensions();

    const isMobile =
        width < 768;

    useEffect(() => {
        async function load() {
            try {
                const all =
                    await getPokemons(151);

                const shuffled = [...all].sort(
                    () => Math.random() - 0.5
                );

                setMyTeam(
                    shuffled.slice(
                        0,
                        MY_TEAM_SIZE
                    )
                );

                setRandomPokemons(
                    shuffled.slice(
                        MY_TEAM_SIZE,
                        MY_TEAM_SIZE +
                            POKEDEX_SIZE
                    )
                );
            } catch (e) {
                console.error(
                    'Erro ao carregar pokémons:',
                    e
                );
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    const renderMyTeamCard = (
        pokemon: Pokemon
    ) => {
        const ptTypes =
            pokemon.tipos.map(mapType);

        return (
            <View
                key={pokemon.index}
                style={
                    styles.teamCardWrapper
                }
            >
                <Card
                    title={pokemon.nome}
                    image={{
                        uri: pokemon.imagem,
                    }}
                    tipos={ptTypes}
                    poderes={
                        pokemon.poderes
                    }
                    index={Number(
                        pokemon.index
                    )}
                    showStats
                />
            </View>
        );
    };

    const renderGridCard = (
        pokemon: Pokemon
    ) => {
        const ptTypes =
            pokemon.tipos.map(mapType);

        return (
            <Card
                key={pokemon.index}
                title={pokemon.nome}
                image={{
                    uri: pokemon.imagem,
                }}
                tipos={ptTypes}
                poderes={
                    pokemon.poderes
                }
                index={Number(
                    pokemon.index
                )}
                showStats
            />
        );
    };

    return (
        <View style={styles.wrapper}>
            <BackgroundPokemons />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={
                    styles.scrollContent
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
            <Header />
                <View
                    style={
                        styles.sectionHeader
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Meu Time Escolhido
                    </Text>

                    <View
                        style={
                            styles.sectionAccent
                        }
                    />

                    {!loading && (
                        <Text
                            style={
                                styles.sectionSub
                            }
                        >
                            {
                                myTeam.length
                            }{' '}
                            selecionados
                        </Text>
                    )}
                </View>

                {/* TIME */}
                {!loading && (
                    <View
                        style={[
                            styles.teamContainer,

                            isMobile && {
                                flexDirection:
                                    'column',
                            },
                        ]}
                    >
                        {myTeam.map(
                            (
                                pokemon
                            ) =>
                                renderMyTeamCard(
                                    pokemon
                                )
                        )}
                    </View>
                )}

                {/* POKEDEX */}
                <View
                    style={[
                        styles.sectionHeader,
                        styles.sectionHeaderList,
                    ]}
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Meus Pokémons
                    </Text>

                    <View
                        style={
                            styles.sectionAccent
                        }
                    />

                    {!loading && (
                        <Text
                            style={
                                styles.sectionSub
                            }
                        >
                            25 aleatórios
                        </Text>
                    )}
                </View>

                {loading ? (
                    <PokeballLoading />
                ) : (
                    <List
                        data={
                            randomPokemons
                        }
                        columns={
                            isMobile
                                ? 1
                                : 3
                        }
                        scrollEnabled={
                            false
                        }
                        renderItemContent={
                            renderGridCard
                        }
                        contentContainerStyle={
                            styles.listContent
                        }
                    />
                )}

                <Footer />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor:
            Colors.background,
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 0,
        flexGrow: 1,
    },

    sectionHeader: {
        paddingHorizontal: 20,
        marginTop: 26,
        marginBottom: 18,
        alignItems: 'center',
    },

    sectionHeaderList: {
        marginTop: 36,
    },

    sectionAccent: {
        width: 140,
        height: 5,
        borderRadius: 999,
        backgroundColor:
            Colors.black,
        marginBottom: 12,
        marginTop: 10,
    },

    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.title,
        textAlign: 'center',
    },

    sectionSub: {
        marginTop: 6,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.subtitle,
        textAlign: 'center',
    },

    /* TIME */

    teamContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:
            'center',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        marginTop: 10,
    },

    teamCardWrapper: {
        transform: [
            {
                scale: 0.92,
            },
        ],
    },

    /* LIST */

    listContent: {
        paddingBottom: 10,
    },
});