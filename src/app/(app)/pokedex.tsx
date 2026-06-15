import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/loading';
import { Background } from '@/components/background';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Menu } from '@/components/menu';
import { Card } from '@/components/card';
import { List } from '@/components/list';
import { Alert } from '@/components/alert';
import { Colors } from '@/constants/colors';
import {
  addCapturedPokemon,
  getPokemons,
  getUserTeam,
} from '@/integration/pokemonIntegration';
import { Pokemon } from '@/@types/pokemon';
import { TYPE_MAP } from '@/constants/pokemon';

const mapType = (t: string) => TYPE_MAP[t] ?? 'normal';
const POKEMON_LIMIT = 151;
const CAPTURE_ANIMATION_MS = 2350;
const WebDiv = 'div' as any;

function injectCaptureStyles() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById('capture-animation-styles')) return;

  const style = document.createElement('style');
  style.id = 'capture-animation-styles';
  style.innerHTML = `
    @keyframes pokeballRise {
      0% {
        opacity: 0;
        transform: translate(-50%, 84px) scale(0.72) rotate(-30deg);
      }
      16% {
        opacity: 1;
        transform: translate(-50%, 58px) scale(0.9) rotate(60deg);
      }
      48% {
        opacity: 1;
        transform: translate(-50%, -118px) scale(1.1) rotate(300deg);
      }
      58% {
        opacity: 1;
        transform: translate(-50%, -118px) scale(1.18) rotate(320deg);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -118px) scale(1) rotate(320deg);
      }
    }

    @keyframes cardSuction {
      0% {
        opacity: 1;
        filter: blur(0);
        transform: scale(1) translateY(0);
      }
      35% {
        opacity: 1;
        filter: blur(0);
        transform: scale(1.035) translateY(-4px);
      }
      100% {
        opacity: 0;
        filter: blur(5px);
        transform: scale(0.18) translateY(-74px);
      }
    }

    @keyframes capturePulse {
      0%, 100% {
        opacity: 0;
        transform: scale(0.92);
      }
      35% {
        opacity: 1;
        transform: scale(1.08);
      }
      70% {
        opacity: 0.45;
        transform: scale(1.18);
      }
    }

    @keyframes pokeballShake {
      0%, 58% {
        transform: translate(-50%, -118px) rotate(320deg);
      }
      64% {
        transform: translate(-50%, -118px) rotate(342deg);
      }
      70% {
        transform: translate(-50%, -118px) rotate(298deg);
      }
      76% {
        transform: translate(-50%, -118px) rotate(338deg);
      }
      82% {
        transform: translate(-50%, -118px) rotate(304deg);
      }
      88% {
        transform: translate(-50%, -118px) rotate(330deg);
      }
      94%, 100% {
        transform: translate(-50%, -118px) rotate(320deg);
      }
    }

    @keyframes capturedPop {
      0%, 74% {
        opacity: 0;
        transform: translateY(10px) scale(0.92);
      }
      88% {
        opacity: 1;
        transform: translateY(-2px) scale(1.04);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .capture-card-shell {
      position: relative;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .capture-card-content {
      transform-origin: 50% 64%;
    }

    .capture-pulse {
      pointer-events: none;
      position: absolute;
      left: 50%;
      top: 42%;
      width: 210px;
      height: 210px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,213,74,0.45) 32%, rgba(102,205,170,0) 68%);
      opacity: 0;
      transform: translate(-50%, -50%);
      z-index: 5;
    }

    .capture-pokeball {
      pointer-events: none;
      position: absolute;
      left: 50%;
      bottom: 44px;
      width: 46px;
      height: 46px;
      border-radius: 999px;
      border: 3px solid #2b2b2b;
      background: linear-gradient(#e83f45 0 48%, #2b2b2b 48% 56%, #ffffff 56% 100%);
      opacity: 0;
      z-index: 8;
      box-shadow: 0 8px 20px rgba(0,0,0,0.22), 0 0 20px rgba(255,255,255,0.9);
    }

    .capture-pokeball::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 15px;
      height: 15px;
      border-radius: 999px;
      background: #fff;
      border: 3px solid #2b2b2b;
      transform: translate(-50%, -50%);
      box-shadow: inset 0 0 0 2px rgba(0,0,0,0.08);
    }

    .capture-success-label {
      pointer-events: none;
      position: absolute;
      left: 50%;
      top: 38%;
      transform: translateX(-50%);
      padding: 9px 18px;
      border-radius: 999px;
      color: #1f483d;
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid #66cdaa;
      font-weight: 900;
      box-shadow: 0 10px 24px rgba(0,0,0,0.18);
      opacity: 0;
      z-index: 9;
      white-space: nowrap;
    }

    .capture-card-shell.is-capturing .capture-card-content {
      animation: cardSuction 920ms cubic-bezier(0.2, 0.78, 0.22, 1) 620ms forwards;
    }

    .capture-card-shell.is-capturing .capture-pulse {
      animation: capturePulse 900ms ease-out 520ms forwards;
    }

    .capture-card-shell.is-capturing .capture-pokeball {
      animation: pokeballRise 1.45s cubic-bezier(0.22, 0.86, 0.25, 1) forwards, pokeballShake 850ms ease-in-out 1.45s forwards;
    }

    .capture-card-shell.is-capturing .capture-success-label {
      animation: capturedPop 2.28s ease-out forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      .capture-card-shell.is-capturing .capture-card-content,
      .capture-card-shell.is-capturing .capture-pulse,
      .capture-card-shell.is-capturing .capture-pokeball,
      .capture-card-shell.is-capturing .capture-success-label {
        animation-duration: 1ms !important;
        animation-delay: 0ms !important;
      }

      .capture-card-shell.is-capturing .capture-card-content {
        opacity: 0.2;
        filter: none;
        transform: none;
      }
    }
  `;

  document.head.appendChild(style);
}

export default function Pokedex() {
  const { user, userId } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 560;

  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [savingPokemon, setSavingPokemon] = useState<number | null>(null);
  const [capturedIds, setCapturedIds] = useState<number[]>([]);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const columns = width >= 1100 ? 3 : width >= 560 ? 2 : 1;

  useEffect(() => {
    injectCaptureStyles();

    async function loadData() {
      try {
        const [pokemonData, userTeam] = await Promise.all([
          getPokemons(POKEMON_LIMIT),
          userId ? getUserTeam(userId) : Promise.resolve(null),
        ]);

        setPokemons(pokemonData || []);
        setCapturedIds(
          userTeam
            ? [...userTeam.team, ...userTeam.capture].map((pokemon) =>
                Number(pokemon.index)
              )
            : []
        );
      } catch (e) {
        console.error('Erro ao carregar pokemons:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  const capturedIdSet = useMemo(() => new Set(capturedIds), [capturedIds]);

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
    setIsAlertVisible(true);
  }

  const handleCapture = useCallback(
    async (pokemon: Pokemon) => {
      if (!userId) {
        setAlertData({
          title: 'Login necessario',
          message: 'Entre na conta antes de capturar Pokemon.',
          type: 'warning',
        });
        setIsAlertVisible(true);
        return;
      }

      const pokemonId = Number(pokemon.index);

      if (capturedIdSet.has(pokemonId) || savingPokemon !== null) return;

      setSavingPokemon(pokemonId);

      try {
        await Promise.all([
          addCapturedPokemon(userId, pokemonId),
          new Promise((resolve) => setTimeout(resolve, CAPTURE_ANIMATION_MS)),
        ]);

        setCapturedIds((current) =>
          current.includes(pokemonId) ? current : [...current, pokemonId]
        );
        setAlertData({
          title: 'Pokemon capturado',
          message: `${pokemon.nome} foi adicionado aos seus capturados.`,
          type: 'success',
        });
      } catch (error) {
        setAlertData({
          title: 'Erro na captura',
          message: 'Nao foi possivel capturar este Pokemon agora.',
          type: 'error',
        });
      } finally {
        setSavingPokemon(null);
        setIsAlertVisible(true);
      }
    },
    [capturedIdSet, savingPokemon, userId]
  );

  const confirmCapture = useCallback(
    (pokemon: Pokemon) => {
      requestConfirmation(
        'Confirmar captura',
        `Deseja mesmo capturar ${pokemon.nome}?`,
        () => {
          handleCapture(pokemon);
        }
      );
    },
    [handleCapture]
  );

  const renderPokemonCard = useCallback(
    (item: Pokemon) => {
      const tipos = item?.tipos?.map(mapType) || [];
      const pokemonId = Number(item.index);
      const isCapturing = savingPokemon === pokemonId;
      const isCaptured = capturedIdSet.has(pokemonId);
      const shellClassName = [
        'capture-card-shell',
        isCapturing ? 'is-capturing' : '',
        isCaptured ? 'is-captured' : '',
      ]
        .filter(Boolean)
        .join(' ');
      const cardContent = (
        <Card
          title={item.nome}
          image={{ uri: item.imagem }}
          tipos={tipos}
          poderes={item.poderes}
          index={pokemonId}
          showDetailsButton
        />
      );
      const captureButton = (
        <Pressable
          style={[
            styles.captureButton,
            (isCapturing || isCaptured) && styles.captureButtonActive,
            isCaptured && styles.captureButtonCaptured,
          ]}
          onPress={() => confirmCapture(item)}
          disabled={isCapturing || isCaptured || savingPokemon !== null}
        >
          <View style={styles.captureButtonGlow} />
          <Text
            style={[
              styles.captureButtonText,
              isCaptured && styles.captureButtonTextCaptured,
            ]}
          >
            {isCaptured
              ? 'Capturado'
              : isCapturing
              ? 'Capturando...'
              : 'Capturar'}
          </Text>
        </Pressable>
      );

      if (Platform.OS === 'web') {
        return (
          <WebDiv key={item.index} className={shellClassName}>
            <WebDiv className="capture-card-content">{cardContent}</WebDiv>
            <WebDiv className="capture-pulse" />
            <WebDiv className="capture-pokeball" />
            <WebDiv className="capture-success-label">Capturado!</WebDiv>
            {captureButton}
          </WebDiv>
        );
      }

      return (
        <View key={item.index} style={styles.cardWithAction}>
          {cardContent}
          {captureButton}
        </View>
      );
    },
    [capturedIdSet, confirmCapture, savingPokemon]
  );

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
          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Bem-vindo a Pokedex, {user}!
          </Text>
          <View style={[styles.line, isMobile && styles.lineMobile]} />
          <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
            Explore os 151 primeiros pokemons e capture para sua conta
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

      <Alert
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        visible={isAlertVisible}
        onClose={() => {
          setIsAlertVisible(false);
          setConfirmAction(null);
        }}
        actions={
          confirmAction
            ? [
                {
                  label: 'Cancelar',
                  variant: 'secondary',
                  onPress: () => {
                    setIsAlertVisible(false);
                    setConfirmAction(null);
                  },
                },
                {
                  label: 'Confirmar',
                  variant: 'primary',
                  onPress: () => {
                    const action = confirmAction;
                    setIsAlertVisible(false);
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
    height: 5,
    backgroundColor: Colors.text,
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 3,
  },
  lineMobile: {
    width: 200,
  },
  cardWithAction: {
    alignItems: 'center',
    position: 'relative',
  },
  captureButton: {
    width: '86%',
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.65)',
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  captureButtonActive: {
    backgroundColor: '#1f9a7c',
    shadowOpacity: 0.55,
  },
  captureButtonCaptured: {
    backgroundColor: Colors.details,
    shadowColor: Colors.details,
  },
  captureButtonText: {
    color: Colors.white,
    fontWeight: '900',
    letterSpacing: 0.3,
    zIndex: 2,
  },
  captureButtonTextCaptured: {
    color: Colors.gray[800],
  },
  captureButtonGlow: {
    position: 'absolute',
    top: -18,
    right: -34,
    width: 110,
    height: 70,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    transform: [{ rotate: '-16deg' }],
  },
});
