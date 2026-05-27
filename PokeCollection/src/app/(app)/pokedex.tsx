import React, { useEffect, useState, useCallback, } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { List } from '@/components/list';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PokeballLoading } from '@/components/pokeballLoading';
import { Colors } from '@/constants/colors';
import { getPokemons } from '@/integration/pokemonIntegration';
import { Pokemon } from '@/@types/pokemon';
import { TYPE_MAP } from '@/constants/pokemon';
import { Card } from '@/components/card';
import { BackgroundPokemons } from '@/components/backgroundPokemons';

const mapType = (t: string) =>
  TYPE_MAP[t] ?? 'normal';

const POKEMON_LIMIT = 151;

export default function Pokedex() {
  const { user, signOut } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [pokemons, setPokemons] =
    useState<Pokemon[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data =
          await getPokemons(
            POKEMON_LIMIT
          );

        setPokemons(data || []);
      } catch (e) {
        console.error(
          'Erro ao carregar pokémons:',
          e
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleLoadMore =
    useCallback(() => {}, []);

  const renderPokemonCard =
    useCallback(
      (pokemon: Pokemon) => {
        if (!pokemon) return null;

        const tipos =
          pokemon.tipos?.map(
            mapType
          ) || [];

        return (
        <Card
          title={pokemon.nome}
          image={{
            uri: pokemon.imagem,
          }}
          tipos={tipos}
          poderes={pokemon.poderes}
          showDetailsButton
        />
        );
      },
      []
    );

  if (loading) {
    return (
      <PokeballLoading />
    );
  }

  return (
    <View style={styles.wrapper}>
      <BackgroundPokemons />

      <Header />

      <Text
        style={
          styles.title
        }
      >
        Bem-vindo a Pokédex, {user}!
      </Text>

      <View
          style={styles.line}
      />

      <Text
        style={
          styles.subtitle
        }
      >
        Explore os 151 primeiros pokémons! ✨
      </Text>

      <View style={styles.listContainer}>
        <List
          data={pokemons}
          onLoadMore={
            handleLoadMore
          }
          renderItemContent={
            renderPokemonCard
          }
        />
      </View>
      <Footer />
    </View>
  );
}

const styles =
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    listContainer: {
      flex: 1,
    },

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
        marginBottom: 20,
    },

    line: {
      width: 355,
      height: 5,
      backgroundColor:
        Colors.text,
      alignSelf: "center",
      marginVertical: 12,
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
  });