import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { List } from '@/components/list';
import { Card } from '@/components/card';
import { Menu } from '@/components/menu';
import { Background } from '@/components/background';
import { getPokemons } from '@/integration/pokemonIntegration';
import { Footer } from '@/components/footer';
import { Pokemon } from '@/@types/pokemon';
import { Colors } from '@/constants/colors';
import { TYPE_MAP } from '@/constants/pokemon';

const mapType = (t: string) => TYPE_MAP[t] ?? 'normal';

const MY_TEAM_SIZE = 5;
const POKEDEX_SIZE = 25;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [myTeam, setMyTeam] = useState<Pokemon[]>([]);
  const [randomPokemons, setRandomPokemons] = useState<Pokemon[]>([]);

  const { width } = useWindowDimensions();

  const isMobile = width < 560;
  const pokedexColumns = width >= 1100 ? 3 : width >= 560 ? 2 : 1;

  // ✅ useMemo ANTES do early return
  const teamRows: Pokemon[][] = React.useMemo(() => {
    if (width >= 1100) {
      return [myTeam.slice(0, 2), myTeam.slice(2, 5)];
    }
    if (width >= 560) {
      return [
        myTeam.slice(0, 2),
        myTeam.slice(2, 4),
        myTeam.slice(4, 5),
      ];
    }
    return myTeam.map((p) => [p]);
  }, [width, myTeam]);

  useEffect(() => {
    async function load() {
      try {
        const all = await getPokemons(151);
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        setMyTeam(shuffled.slice(0, MY_TEAM_SIZE));
        setRandomPokemons(shuffled.slice(MY_TEAM_SIZE, MY_TEAM_SIZE + POKEDEX_SIZE));
      } catch (e) {
        console.error('Erro ao carregar pokémons:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ✅ Early return DEPOIS de todos os hooks
  if (loading) {
    return <Loading />;
  }

  const renderMyTeamCard = (pokemon: Pokemon) => {
    const ptTypes = pokemon.tipos.map(mapType);
    return (
      <View key={pokemon.index} style={styles.teamCardWrapper}>
        <Card
          title={pokemon.nome}
          image={{ uri: pokemon.imagem }}
          tipos={ptTypes}
          poderes={pokemon.poderes}
          index={Number(pokemon.index)}
          showStats
        />
      </View>
    );
  };

  const renderGridCard = (pokemon: Pokemon) => {
    const ptTypes = pokemon.tipos.map(mapType);
    return (
      <Card
        key={pokemon.index}
        title={pokemon.nome}
        image={{ uri: pokemon.imagem }}
        tipos={ptTypes}
        poderes={pokemon.poderes}
        index={Number(pokemon.index)}
        showStats
      />
    );
  };

  return (
    <View style={styles.wrapper}>
      <Background />
      {!isMobile && <Menu />}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {/* SEÇÃO: MEU TIME */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meu Time Escolhido</Text>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionSub}>{myTeam.length} selecionados</Text>
        </View>

        <View style={styles.teamContainer}>
          {teamRows.map((row, idx) => (
            <View key={idx} style={styles.teamRow}>
              {row.map(renderMyTeamCard)}
            </View>
          ))}
        </View>

        {/* SEÇÃO: POKÉDEX */}
        <View style={[styles.sectionHeader, styles.sectionHeaderList]}>
          <Text style={styles.sectionTitle}>Meus Pokémons</Text>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionSub}>25 aleatórios</Text>
        </View>

        <List
          data={randomPokemons}
          columns={pokedexColumns}
          scrollEnabled={false}
          renderItemContent={renderGridCard}
          contentContainerStyle={styles.listContent}
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
    backgroundColor: Colors.black,
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

  teamContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  teamRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },

  teamCardWrapper: {
    transform: [{ scale: 0.92 }],
  },

  listContent: {
    paddingBottom: 10,
  },
});