import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { List } from '@/components/list';
import { Card } from '@/components/card';
import { Alert } from '@/components/alert';
import { Menu } from '@/components/menu';
import { Background } from '@/components/background';
import { Footer } from '@/components/footer';
import { Pokemon } from '@/@types/pokemon';
import { Colors } from '@/constants/colors';
import { TYPE_MAP } from '@/constants/pokemon';
import { useAuth } from '@/context/AuthContext';
import {
  deleteCapturedPokemon,
  getUserTeam,
  updateUserTeam,
} from '@/integration/kleberIntegration';

const mapType = (t: string) => TYPE_MAP[t] ?? 'normal';

export default function Team() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [myTeam, setMyTeam] = useState<Pokemon[]>([]);
  const [capturedPokemons, setCapturedPokemons] = useState<Pokemon[]>([]);
  const [selectedTeamPokemon, setSelectedTeamPokemon] = useState<number | null>(
    null
  );
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const starPulse = React.useRef(new Animated.Value(0.55)).current;
  const starScale = React.useRef(new Animated.Value(0.98)).current;

  const { width } = useWindowDimensions();

  const isMobile = width < 560;
  const pokedexColumns = width >= 1120 ? 3 : width >= 760 ? 2 : 1;

  const loadTeam = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await getUserTeam(userId);
      setMyTeam(response.team);
      setCapturedPokemons(response.capture);
      setSelectedTeamPokemon(
        response.team.length ? Number(response.team[0].index) : null
      );
    } catch (e) {
      console.error('Erro ao carregar time:', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(starPulse, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(starPulse, {
            toValue: 0.55,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(starScale, {
            toValue: 1.035,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(starScale, {
            toValue: 0.98,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [starPulse, starScale]);

  const teamRows: Pokemon[][] = useMemo(() => {
    if (width >= 1100) {
      return [myTeam.slice(0, 2), myTeam.slice(2, 5)];
    }
    if (width >= 760) {
      return [
        myTeam.slice(0, 2),
        myTeam.slice(2, 4),
        myTeam.slice(4, 5),
      ];
    }
    return myTeam.map((p) => [p]);
  }, [width, myTeam]);

  function requestConfirmation(
    title: string,
    message: string,
    action: () => void
  ) {
    setAlertData({
      title,
      message,
      type: 'warning',
    });
    setConfirmAction(() => action);
    setAlertVisible(true);
  }

  async function performChangeTeam(newPokemon: Pokemon) {
    if (!userId || busy) return;

    if (!selectedTeamPokemon) {
      setAlertData({
        title: 'Escolha quem sai',
        message: 'Selecione um Pokemon do seu time antes de trocar.',
        type: 'warning',
      });
      setAlertVisible(true);
      return;
    }

    setBusy(true);

    try {
      await updateUserTeam(userId, selectedTeamPokemon, Number(newPokemon.index));
      await loadTeam();
      setAlertData({
        title: 'Time atualizado',
        message: `${newPokemon.nome} entrou no seu time.`,
        type: 'success',
      });
      setAlertVisible(true);
    } catch (error) {
      console.error('Erro ao atualizar time:', error);
      setAlertData({
        title: 'Erro ao trocar',
        message:
          'A API nao conseguiu atualizar o time. Tente novamente com outro Pokemon.',
        type: 'error',
      });
      setAlertVisible(true);
    } finally {
      setBusy(false);
    }
  }

  function handleChangeTeam(newPokemon: Pokemon) {
    requestConfirmation(
      'Confirmar troca',
      `Deseja mesmo colocar ${newPokemon.nome} no time no lugar do Pokemon selecionado?`,
      () => {
        performChangeTeam(newPokemon);
      }
    );
  }

  async function performDeleteCaptured(pokemon: Pokemon) {
    if (!userId || busy) return;

    setBusy(true);

    try {
      await deleteCapturedPokemon(userId, Number(pokemon.index));
      await loadTeam();
      setAlertData({
        title: 'Captura removida',
        message: `${pokemon.nome} saiu dos seus capturados.`,
        type: 'success',
      });
      setAlertVisible(true);
    } catch (error) {
      console.error('Erro ao remover capturado:', error);
      setAlertData({
        title: 'Erro ao remover',
        message: 'Nao foi possivel remover este Pokemon capturado.',
        type: 'error',
      });
      setAlertVisible(true);
    } finally {
      setBusy(false);
    }
  }

  function handleDeleteCaptured(pokemon: Pokemon) {
    requestConfirmation(
      'Remover captura',
      `Deseja mesmo remover ${pokemon.nome} dos seus capturados?`,
      () => {
        performDeleteCaptured(pokemon);
      }
    );
  }

  function handleSelectTeamPokemon(pokemon: Pokemon) {
    const pokemonId = Number(pokemon.index);

    if (selectedTeamPokemon === pokemonId) return;

    requestConfirmation(
      'Selecionar para troca',
      `Deseja selecionar ${pokemon.nome} como o Pokemon que vai sair do time?`,
      () => {
        setSelectedTeamPokemon(pokemonId);
      }
    );
  }

  if (loading) {
    return <Loading />;
  }

  const renderMyTeamCard = (pokemon: Pokemon) => {
    const ptTypes = pokemon.tipos.map(mapType);
    const pokemonId = Number(pokemon.index);
    const selected = selectedTeamPokemon === pokemonId;

    return (
      <View
        key={pokemon.index}
        style={[
          styles.teamCardWrapper,
          selected && styles.selectedTeamCard,
        ]}
      >
        {selected && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.selectedGlow,
              {
                opacity: starPulse,
                transform: [{ scale: starScale }],
              },
            ]}
          />
        )}

        <Card
          title={pokemon.nome}
          image={{ uri: pokemon.imagem }}
          tipos={ptTypes}
          poderes={pokemon.poderes}
          index={pokemonId}
          showStats
        />

        <Pressable
          style={[
            styles.selectButton,
            selected && styles.selectButtonActive,
          ]}
          onPress={() => handleSelectTeamPokemon(pokemon)}
        >
          <Text
            style={[
              styles.selectButtonText,
              selected && styles.selectButtonTextActive,
            ]}
          >
            {selected ? 'Selecionado para sair' : 'Escolher para trocar'}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderCapturedCard = (pokemon: Pokemon) => {
    const ptTypes = pokemon.tipos.map(mapType);

    return (
      <View key={pokemon.index} style={styles.capturedCard}>
        <Card
          title={pokemon.nome}
          image={{ uri: pokemon.imagem }}
          tipos={ptTypes}
          poderes={pokemon.poderes}
          index={Number(pokemon.index)}
          showStats
        />

        <View style={[styles.cardActions, isMobile && styles.cardActionsMobile]}>
          <Pressable
            style={[
              styles.actionButton,
              (!selectedTeamPokemon || busy) && styles.actionDisabled,
            ]}
            onPress={() => handleChangeTeam(pokemon)}
            disabled={!selectedTeamPokemon || busy}
          >
            <Text style={styles.actionText}>Trocar para o time</Text>
          </Pressable>

          <Pressable
            style={[styles.deleteButton, busy && styles.actionDisabled]}
            onPress={() => handleDeleteCaptured(pokemon)}
            disabled={busy}
          >
            <Text style={styles.deleteText}>Remover captura</Text>
          </Pressable>
        </View>
      </View>
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

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
            Meu Time Escolhido
          </Text>
          <View style={[styles.sectionAccent, isMobile && styles.sectionAccentMobile]} />
          <Text style={[styles.sectionSub, isMobile && styles.sectionSubMobile]}>
            Toque em um Pokemon do time para escolher quem sera trocado
          </Text>
        </View>

        <View style={styles.teamContainer}>
          {teamRows.map((row, idx) => (
            <View key={idx} style={styles.teamRow}>
              {row.map(renderMyTeamCard)}
            </View>
          ))}
        </View>

        <View style={[styles.sectionHeader, styles.sectionHeaderList]}>
          <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
            Pokemons Capturados
          </Text>
          <View style={[styles.sectionAccent, isMobile && styles.sectionAccentMobile]} />
          <Text style={[styles.sectionSub, isMobile && styles.sectionSubMobile]}>
            {capturedPokemons.length} capturados pela API
          </Text>
        </View>

        {capturedPokemons.length ? (
          <List
            data={capturedPokemons}
            columns={pokedexColumns}
            scrollEnabled={false}
            renderItemContent={renderCapturedCard}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.emptyText}>
            Nenhum Pokemon capturado ainda. Capture pela Pokedex.
          </Text>
        )}

        <Footer />
      </ScrollView>

      <Alert
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        visible={alertVisible}
        onClose={() => {
          setAlertVisible(false);
          setConfirmAction(null);
        }}
        actions={
          confirmAction
            ? [
                {
                  label: 'Cancelar',
                  variant: 'secondary',
                  onPress: () => {
                    setAlertVisible(false);
                    setConfirmAction(null);
                  },
                },
                {
                  label: 'Confirmar',
                  variant: 'primary',
                  onPress: () => {
                    const action = confirmAction;
                    setAlertVisible(false);
                    setConfirmAction(null);
                    action?.();
                  },
                },
              ]
            : undefined
        }
      />
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
  sectionAccentMobile: {
    width: 100,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.title,
    textAlign: 'center',
  },
  sectionTitleMobile: {
    fontSize: 20,
  },
  sectionSub: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.subtitle,
    textAlign: 'center',
  },
  sectionSubMobile: {
    fontSize: 14,
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
    borderRadius: 28,
    position: 'relative',
    padding: 2,
  },
  selectedTeamCard: {
    shadowColor: Colors.details,
    shadowOpacity: 0.75,
    shadowRadius: 24,
    elevation: 12,
  },
  selectedGlow: {
    position: 'absolute',
    top: 8,
    right: 8,
    bottom: 34,
    left: 8,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 213, 74, 0.20)',
    shadowColor: Colors.details,
    shadowOpacity: 0.95,
    shadowRadius: 28,
    elevation: 14,
    zIndex: 2,
  },
  selectButton: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginTop: 8,
    marginBottom: 18,
  },
  selectButtonActive: {
    backgroundColor: Colors.details,
    borderColor: Colors.details,
  },
  selectButtonText: {
    color: Colors.primary,
    fontWeight: '900',
  },
  selectButtonTextActive: {
    color: Colors.gray[800],
  },
  capturedCard: {
    alignItems: 'center',
  },
  cardActions: {
    width: '94%',
    gap: 12,
    marginTop: 18,
    marginBottom: 30,
  },
  cardActionsMobile: {
    width: Platform.OS === 'android' ? '100%' : '96%',
    maxWidth: 280,
    paddingHorizontal: Platform.OS === 'android' ? 8 : 0,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    minHeight: 54,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    minHeight: 54,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionText: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 14,
    textAlign: 'center',
  },
  deleteText: {
    color: Colors.primary,
    fontWeight: '900',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    color: Colors.subtitle,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 10,
  },
});
