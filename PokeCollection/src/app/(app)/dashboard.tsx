import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';

import { List } from '@/components/list';
import { PokeballHeader } from '@/components/PokeballHeader';
import { PokeballLoading } from '@/components/pokeball-loading';

import { getColor, Colors } from '@/constants/colors';
import { getPokemons } from '@/integration/pokemonIntegration';

import { Pokemon, Poder } from '@/@types/pokemon';
import { TYPE_MAP } from '@/constants/pokemon';

const mapType = (t: string) =>
  TYPE_MAP[t] ?? 'normal';

const STAT_ABBR: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  speed: 'SPD',
};

const POKEMON_LIMIT = 151;

export default function Pokedex() {
  const [loading, setLoading] = useState(true);

  const [pokemons, setPokemons] = useState<
    Pokemon[]
  >([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPokemons(
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

  const handleLoadMore = useCallback(() => {}, []);

  const renderPokemonCard = useCallback(
    (pokemon: Pokemon) => {
      if (!pokemon) return null;

      const ptTypes =
        pokemon?.tipos?.map(mapType) || [];

      const colors = getColor(ptTypes);

      return (
        <>
          {/* TIPOS */}
          <View style={styles.typesRow}>
            {ptTypes.map((type) => {
              const tc = getColor([type]);

              return (
                <View
                  key={type}
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        tc.accent + '22',

                      borderColor:
                        tc.accent + '55',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      {
                        color: tc.accent,
                      },
                    ]}
                  >
                    {type.toUpperCase()}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* DIVISOR */}
          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  colors.accent + '35',
              },
            ]}
          />

          {/* PODERES */}
          <View style={styles.powersSection}>
            <Text
              style={[
                styles.powersLabel,
                {
                  color:
                    colors.accent + 'CC',
                },
              ]}
            >
              PODERES
            </Text>

            <View style={styles.statsGrid}>
              {(pokemon?.poderes || []).map(
                (poder: Poder) => (
                  <View
                    key={
                      poder?.nome ||
                      Math.random().toString()
                    }
                    style={styles.statRow}
                  >
                    <Text
                      style={styles.statName}
                    >
                      {STAT_ABBR[
                        poder?.nome
                      ] ??
                        (
                          poder?.nome ||
                          '???'
                        )
                          .toUpperCase()
                          .slice(0, 6)}
                    </Text>

                    <View
                      style={
                        styles.statBarBg
                      }
                    >
                      <View
                        style={[
                          styles.statBarFill,
                          {
                            width: `${
                              Math.min(
                                ((poder?.forca ||
                                  0) /
                                  150) *
                                  100,
                                100
                              )
                            }%`,
                            backgroundColor:
                              colors.accent,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.statValue,
                        {
                          color:
                            colors.accent,
                        },
                      ]}
                    >
                      {poder?.forca || 0}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        </>
      );
    },
    []
  );

  if (loading) {
    return <PokeballLoading />;
  }

  return (
    <View style={styles.wrapper}>
      <PokeballHeader />

      <Text style={styles.sectionTitle}>
        Pokédex
      </Text>

      <List
        data={pokemons}
        onLoadMore={handleLoadMore}
        renderItemContent={
          renderPokemonCard
        }
      />
    </View>
  );
}

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  sectionTitle: {
    color: Colors.placeholder,
    fontSize: isWeb ? 11 : 10,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
    paddingHorizontal: isWeb
      ? 28
      : 20,
    marginTop: 8,
    marginBottom: 10,

    fontFamily:
      Platform.OS === 'web'
        ? "'Press Start 2P', monospace"
        : undefined,
  },

  typesRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 12,
  },

  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },

  typeBadgeText: {
    fontSize: isWeb ? 9 : 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  powersSection: {
    gap: 6,
  },

  powersLabel: {
    fontSize: isWeb ? 9 : 8,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 2,
  },

  statsGrid: {
    gap: isWeb ? 5 : 4,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statName: {
    color: Colors.white,
    fontSize: isWeb ? 9 : 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    width: isWeb ? 52 : 44,
  },

  statBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#FFFFFF22',
    borderRadius: 2,
    overflow: 'hidden',
  },

  statBarFill: {
    height: '100%',
    borderRadius: 2,
    opacity: 0.85,
  },

  statValue: {
    fontSize: isWeb ? 10 : 9,
    fontWeight: '800',
    width: isWeb ? 28 : 24,
    textAlign: 'right',
  },
});