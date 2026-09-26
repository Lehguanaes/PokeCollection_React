import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/loading';
import { Background } from '@/components/background';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Menu } from '@/components/menu';
import { PokemonCard } from '@/components/pokemonCard';
import { List } from '@/components/list';
import { Colors } from '@/constants/colors';
import { Pokemon } from '@/@types/pokemon';
import { TYPE_MAP } from '@/constants/pokemon';
import { getCapturedPokemons } from '@/integration/capturedPokemonStorage';

const mapType = (type: string) => TYPE_MAP[type] ?? type;

export default function Pokedex() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 560;

  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const columns = width >= 1120 ? 3 : width >= 760 ? 2 : 1;

  const loadCapturedPokemons = useCallback(async () => {
    try {
      const captured = await getCapturedPokemons();
      setPokemons(captured);
    } catch (error) {
      console.error('Erro ao carregar Pokémons capturados:', error);
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCapturedPokemons();
  }, [loadCapturedPokemons]);

  useFocusEffect(
    useCallback(() => {
      void loadCapturedPokemons();
    }, [loadCapturedPokemons])
  );

  const renderPokemonCard = useCallback((item: Pokemon) => {
    const tipos = item?.tipos?.map(mapType) || [];

    return (
      <View key={item.index} style={styles.cardShell}>
        <PokemonCard
          title={item.nome}
          image={{ uri: item.imagem }}
          tipos={tipos}
          poderes={item.poderes}
          index={Number(item.index)}
          showDetailsButton
          animated
        />
      </View>
    );
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.wrapper}>
      <Background />

      {!isMobile && <Menu />}
      <Header />

      <List
        data={pokemons}
        columns={columns}
        renderItemContent={renderPokemonCard}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, isMobile && styles.titleMobile]}>
              Pokédex de {user || 'treinador'}
            </Text>
            <View style={[styles.line, isMobile && styles.lineMobile]} />
            <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
              Pokémons capturados pelo leitor de QR Code
            </Text>
            {!pokemons.length ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Nenhum Pokémon capturado ainda</Text>
                <Text style={styles.emptyText}>
                  Abra a câmera, escaneie um QR Code com o número do Pokémon e capture para preencher sua Pokédex.
                </Text>
              </View>
            ) : null}
          </View>
        }
        ListFooterComponent={<Footer />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.title,
    textAlign: 'center',
  },
  titleMobile: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.subtitle,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitleMobile: {
    fontSize: 14,
  },
  line: {
    width: 355,
    maxWidth: '80%',
    height: 5,
    backgroundColor: Colors.text,
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 3,
  },
  lineMobile: {
    width: 200,
  },
  cardShell: {
    alignItems: 'center',
    marginBottom: 28,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
    borderWidth: 2,
    borderRadius: 24,
    padding: 22,
    marginTop: 8,
    alignItems: 'center',
  },
  emptyTitle: {
    color: Colors.title,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyText: {
    color: Colors.subtitle,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});
