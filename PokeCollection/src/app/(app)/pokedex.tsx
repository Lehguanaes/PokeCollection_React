import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/loading';
import { Background } from '@/components/background';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Menu } from '@/components/menu';
import { Card } from '@/components/card';
import { List } from '@/components/list';
import { Colors } from '@/constants/colors';
import { getPokemons } from '@/integration/pokemonIntegration';
import { Pokemon } from '@/@types/pokemon';
import { TYPE_MAP } from '@/constants/pokemon';

const mapType = (t: string) => TYPE_MAP[t] ?? 'normal';
const POKEMON_LIMIT = 151;

export default function Pokedex() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const columns = width >= 1100 ? 3 : width >= 560 ? 2 : 1;

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPokemons(POKEMON_LIMIT);
        setPokemons(data || []);
      } catch (e) {
        console.error('Erro ao carregar pokémons:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const renderPokemonCard = useCallback((item: Pokemon) => {
    const tipos = item?.tipos?.map(mapType) || [];
    return (
      <Card
        key={item.index}
        title={item.nome}
        image={{ uri: item.imagem }}
        tipos={tipos}
        poderes={item.poderes}
        showDetailsButton
      />
    );
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.wrapper}>
      <Background />

      {!isMobile && <Menu />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        <View style={styles.header}>
          <Text style={styles.title}>
            Bem-vindo a Pokédex, {user}!
          </Text>
          <View style={styles.line} />
          <Text style={styles.subtitle}>
            Explore os 151 primeiros pokémons! ✨
          </Text>
        </View>

        <List
          data={pokemons}
          columns={columns}
          renderItemContent={renderPokemonCard}
          scrollEnabled={false}
        />

        <Footer />
      </ScrollView>
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
    backgroundColor: Colors.text,
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 3,
  },
});