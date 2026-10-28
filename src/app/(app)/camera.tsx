/*
 * Esta página Android realiza a captura de Pokémon por QR Code.
 * O wrapper da rota bloqueia web/iOS antes de montar os hooks nativos de câmera.
 * Gerencia permissões, localização, persistência e retorno visual da captura.
 */
// Hooks e primitivas nativas controlam câmera, estados visuais e animação da captura.
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// APIs do Expo fornecem leitura de QR Code, permissão de câmera, localização e navegação.
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Camera, QrCode } from 'lucide-react-native';
import { Redirect, useRouter } from 'expo-router';
// Componentes e cores compartilhados mantêm esta experiência alinhada ao restante do app.
import { Screen } from '@/components/screen';
import { Button } from '@/components/button';
import { Header } from '@/components/header';
import { Heading } from '@/components/heading';
import { Colors } from '@/constants/colors';
// Integração, tipos e contexto ligam o código lido ao Pokémon persistido na coleção.
import { getPokemonById } from '@/integration/pokemonIntegration';
import { Pokemon } from '@/@types/pokemon';
import { CaptureLocation } from '@/@types/collection';
import { useCollection } from '@/context/CollectionContext';

// A mensagem padrão deixa claro que a câmera está ativa mesmo antes de encontrar um código.
const IDLE_MESSAGE = 'Procurando QR Code para capturar um Pokémon.';

// Aceita somente ids da primeira geração para impedir consultas fora do catálogo do aplicativo.
function getPokemonId(code: string) {
  const value = code.trim();
  if (!/^\d{1,3}$/.test(value)) return null;

  const id = Number(value);
  return Number.isInteger(id) && id >= 1 && id <= 151 ? id : null;
}

// Localização é um complemento: qualquer indisponibilidade retorna undefined sem cancelar a captura.
async function getCaptureLocation(): Promise<CaptureLocation | undefined> {
  try {
    if (!(await Location.hasServicesEnabledAsync())) return undefined;

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== Location.PermissionStatus.GRANTED) return undefined;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch {
    return undefined;
  }
}

export default function CameraPage() {
  if (Platform.OS !== 'android') return <Redirect href="/pokedex" />;

  return <AndroidCameraPage />;
}

function AndroidCameraPage() {
  // Refs guardam recursos imperativos e travas que precisam sobreviver a novas renderizações.
  const cameraRef = useRef<CameraView>(null);
  const processingRef = useRef(false);
  const router = useRouter();
  const { capture, captures, isCaptured } = useCollection();
  const [permission, requestPermission] = useCameraPermissions();
  // Estados descrevem processamento, mensagens e as duas fases do aviso de captura.
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(IDLE_MESSAGE);
  const [captureNotice, setCaptureNotice] = useState<Pokemon | null>(null);
  const [noticePhase, setNoticePhase] = useState<'ball' | 'card'>('ball');
  const [lastCapturedPokemon, setLastCapturedPokemon] = useState<Pokemon | null>(null);
  const [wasAlreadyCaptured, setWasAlreadyCaptured] = useState(false);
  // Temporizador e valor animado coordenam a revelação sem disparar renderizações a cada quadro.
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealAnimation = useRef(new Animated.Value(0)).current;

  // Ao sair da tela, interrompe trabalhos visuais pendentes para evitar atualizações tardias.
  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      revealAnimation.stopAnimation();
    };
  }, [revealAnimation]);

  // Reinicia a sequência Pokébola -> cartão para que capturas consecutivas não compartilhem estado.
  function showCaptureNotice(pokemon: Pokemon) {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);

    revealAnimation.stopAnimation();
    revealAnimation.setValue(0);
    setNoticePhase('ball');
    setCaptureNotice(pokemon);
    // A conclusão da animação troca o efeito pelo cartão, que se fecha automaticamente depois.
    Animated.timing(revealAnimation, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

      setNoticePhase('card');
      noticeTimer.current = setTimeout(() => {
        setCaptureNotice(null);
        noticeTimer.current = null;
      }, 4000);
    });
  }

  // Cancela o aviso antes da navegação para não manter timer ou animação após trocar de rota.
  function openPokedex() {
    if (noticeTimer.current) {
      clearTimeout(noticeTimer.current);
      noticeTimer.current = null;
    }
    revealAnimation.stopAnimation();
    setCaptureNotice(null);
    router.replace('/pokedex');
  }

  // Converte o QR Code, evita leituras simultâneas e coordena API, localização e persistência.
  async function capturePokemon(code: string) {
    if (processingRef.current) return;

    const pokemonId = getPokemonId(code);

    // Um código inválido recebe orientação imediata sem bloquear a próxima leitura.
    if (!pokemonId) {
      setMessage('Use um QR Code com um número de Pokémon entre 1 e 151.');
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    setMessage('Registrando captura e localização...');

    try {
      // A verificação local evita localização e gravação desnecessárias para uma captura repetida.
      const existing = captures.find(
        (pokemon) => Number(pokemon.index) === pokemonId
      );

      if (existing || isCaptured(pokemonId)) {
        const pokemon = existing ?? (await getPokemonById(pokemonId));
        setLastCapturedPokemon(pokemon);
        setWasAlreadyCaptured(true);
        setMessage(`${pokemon.nome} já está na sua Pokédex.`);
        showCaptureNotice(pokemon);
        return;
      }

      // Detalhes e GPS são independentes, por isso são solicitados em paralelo para reduzir espera.
      const [pokemon, location] = await Promise.all([
        getPokemonById(pokemonId),
        getCaptureLocation(),
      ]);
      const result = await capture(pokemon, location);
      setLastCapturedPokemon(pokemon);
      setWasAlreadyCaptured(result === 'duplicate');

      // O resultado da persistência ainda protege contra duplicidade ocorrida durante a operação.
      if (result === 'duplicate') {
        setMessage(`${pokemon.nome} já está na sua Pokédex.`);
      } else {
        setMessage(
          location
            ? `${pokemon.nome} foi adicionado à sua Pokédex com a localização registrada.`
            : `${pokemon.nome} foi adicionado à sua Pokédex, mas sem localização.`
        );
      }

      showCaptureNotice(pokemon);
    } catch {
      setMessage('Não foi possível capturar esse Pokémon. Confira o QR Code e tente novamente.');
    } finally {
      // A trava sempre é liberada para permitir uma nova tentativa após sucesso ou falha.
      processingRef.current = false;
      setIsProcessing(false);
    }
  }

  // Enquanto o sistema consulta a permissão, uma espera neutra evita montar a câmera cedo demais.
  if (!permission) {
    return (
      <Screen>
        <Header />
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </Screen>
    );
  }

  // Sem autorização, substitui o scanner por uma explicação e uma ação explícita de consentimento.
  if (!permission.granted) {
    return (
      <Screen>
        <Header />
        <View style={styles.center}>
          <Camera size={48} color={Colors.title} />
          <Text style={styles.permissionTitle}>Permita usar a câmera</Text>
          <Text style={styles.permissionText}>
            A câmera será usada somente para ler o QR Code de um Pokémon.
          </Text>
          <Button
            title="Permitir câmera"
            onPress={() => void requestPermission()}
            fullWidth={false}
            style={styles.permissionButton}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.content}>
        {/* Cabeçalho e instrução contextualizam o objetivo antes da área da câmera. */}
        <Header />
        <Heading
          title="Capturar Pokémon"
          subtitle="Escaneie um QR Code que contenha o número do Pokémon."
          variant="compact"
          icon={QrCode}
          style={styles.heading}
        />

        {/* A câmera e o aviso ocupam o mesmo palco para a captura parecer acontecer sobre a imagem. */}
        <View style={styles.cameraStage}>
          <View style={styles.cameraCard}>
            {/* O leitor é pausado durante processamento/aviso para impedir eventos duplicados. */}
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={
                isProcessing || captureNotice
                  ? undefined
                  : ({ data }) => void capturePokemon(data)
              }
            />
            <View style={styles.scannerFrame} pointerEvents="none" />
          </View>

          {/* O overlay alterna entre a abertura animada da Pokébola e o resumo do Pokémon. */}
          {captureNotice ? (
            <View style={styles.noticeOverlay}>
              {noticePhase === 'ball' ? (
                <View style={styles.revealStage}>
                  <Animated.View
                    style={[
                      styles.revealFlash,
                      {
                        opacity: revealAnimation.interpolate({
                          inputRange: [0, 0.45, 1],
                          outputRange: [0, 0.9, 0],
                        }),
                        transform: [
                          {
                            scale: revealAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.2, 2.8],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                  {/* Partículas compartilham a animação, mas seguem direções e cores diferentes. */}
                  {[
                    { x: 0, y: -90, color: Colors.captureReveal.cyan },
                    { x: 72, y: -58, color: Colors.captureReveal.yellow },
                    { x: 94, y: 8, color: Colors.captureReveal.cyan },
                    { x: 62, y: 72, color: Colors.captureReveal.yellow },
                    { x: -62, y: 72, color: Colors.captureReveal.cyan },
                    { x: -94, y: 8, color: Colors.captureReveal.yellow },
                    { x: -72, y: -58, color: Colors.captureReveal.cyan },
                  ].map((particle, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.revealParticle,
                        {
                          backgroundColor: particle.color,
                          opacity: revealAnimation.interpolate({
                            inputRange: [0, 0.28, 0.85, 1],
                            outputRange: [0, 1, 1, 0],
                          }),
                          transform: [
                            {
                              translateX: revealAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, particle.x],
                              }),
                            },
                            {
                              translateY: revealAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, particle.y],
                              }),
                            },
                            {
                              scale: revealAnimation.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0.3, 1.5, 0.4],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  ))}
                  {/* As metades se afastam enquanto o núcleo desaparece, simulando a revelação. */}
                  <View style={styles.revealBall}>
                    <Animated.View
                      style={[
                        styles.revealBallHalf,
                        styles.revealBallTop,
                        {
                          transform: [
                            {
                              translateY: revealAnimation.interpolate({
                                inputRange: [0, 0.45, 1],
                                outputRange: [0, 0, -48],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.revealBallHalf,
                        styles.revealBallBottom,
                        {
                          transform: [
                            {
                              translateY: revealAnimation.interpolate({
                                inputRange: [0, 0.45, 1],
                                outputRange: [0, 0, 48],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.revealBallCenter,
                        {
                          opacity: revealAnimation.interpolate({
                            inputRange: [0, 0.55, 1],
                            outputRange: [1, 1, 0],
                          }),
                        },
                      ]}
                    >
                      <View style={styles.revealBallCore} />
                    </Animated.View>
                  </View>
                </View>
              ) : (
                <View style={styles.noticeCard}>
                  <Image
                    source={{ uri: captureNotice.imagem }}
                    style={styles.noticeImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.noticeTitle}>
                    {wasAlreadyCaptured
                      ? `${captureNotice.nome} já está na sua Pokédex!`
                      : `${captureNotice.nome} foi adicionado à sua Pokédex!`}
                  </Text>
                  <Button
                    title={`Ver ${captureNotice.nome}`}
                    size="small"
                    fullWidth={false}
                    style={styles.noticeButton}
                    onPress={openPokedex}
                  />
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* O painel inferior mantém o estado da última leitura e oferece acesso posterior à Pokédex. */}
        <View style={styles.statusCard}>
          {isProcessing ? <ActivityIndicator color={Colors.primary} /> : <QrCode size={20} color={Colors.primary} />}
          <View style={styles.statusContent}>
            <Text style={styles.statusText}>{message}</Text>
            {lastCapturedPokemon ? (
              <Button
                title={`Ver ${lastCapturedPokemon.nome}`}
                size="small"
                fullWidth={false}
                style={styles.viewPokemonButton}
                onPress={openPokedex}
              />
            ) : null}
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Estrutura geral, estados de permissão e título da tela.
  content: { flex: 1 },
  center: { alignItems: 'center', backgroundColor: Colors.background, flex: 1, justifyContent: 'center', padding: 28 },
  permissionTitle: { color: Colors.title, fontSize: 26, fontWeight: '900', marginTop: 18 },
  permissionText: { color: Colors.subtitle, fontSize: 16, lineHeight: 23, marginTop: 10, maxWidth: 350, textAlign: 'center' },
  heading: { marginBottom: 18, marginTop: 22 },
  // Palco da câmera, recorte e guia visual usada para posicionar o QR Code.
  cameraStage: { alignSelf: 'center', maxWidth: 560, position: 'relative', width: '88%' },
  cameraCard: { backgroundColor: Colors.black, borderColor: Colors.white, borderRadius: 28, borderWidth: 3, overflow: 'hidden', width: '100%' },
  camera: { aspectRatio: 0.76, maxHeight: 440, width: '100%' },
  scannerFrame: { borderColor: Colors.primary, borderRadius: 22, borderWidth: 3, height: '54%', left: '15%', position: 'absolute', top: '23%', width: '70%' },
  // Painel textual que comunica progresso, resultado e atalho para o último Pokémon.
  statusCard: { alignItems: 'center', alignSelf: 'center', backgroundColor: Colors.white, borderColor: Colors.inputBorder, borderRadius: 18, borderWidth: 2, flexDirection: 'row', gap: 10, marginTop: 18, maxWidth: 560, padding: 15, width: '88%' },
  statusContent: { flex: 1 },
  statusText: { color: Colors.subtitle, fontSize: 14, fontWeight: '800', lineHeight: 20 },
  viewPokemonButton: { alignSelf: 'center', borderRadius: 999, marginTop: 9 },
  // Camada escura e elementos luminosos concentram atenção na animação de revelação.
  noticeOverlay: { alignItems: 'center', backgroundColor: Colors.alpha.night66, borderRadius: 26, bottom: 3, justifyContent: 'center', left: 3, position: 'absolute', right: 3, top: 3 },
  revealStage: { alignItems: 'center', height: 230, justifyContent: 'center', width: 230 },
  revealFlash: { backgroundColor: Colors.captureReveal.flash, borderRadius: 60, height: 120, position: 'absolute', width: 120 },
  revealParticle: { borderRadius: 6, height: 12, position: 'absolute', width: 12 },
  // Partes da Pokébola são independentes para permitir separação e desaparecimento coordenados.
  revealBall: { height: 84, position: 'relative', width: 84 },
  revealBallHalf: { borderColor: Colors.black, borderWidth: 4, height: 42, left: 0, position: 'absolute', width: 84 },
  revealBallTop: { backgroundColor: Colors.pokeballRed, borderBottomWidth: 3, borderTopLeftRadius: 42, borderTopRightRadius: 42, top: 0 },
  revealBallBottom: { backgroundColor: Colors.white, borderBottomLeftRadius: 42, borderBottomRightRadius: 42, borderTopWidth: 3, bottom: 0 },
  revealBallCenter: { alignItems: 'center', backgroundColor: Colors.white, borderColor: Colors.black, borderRadius: 15, borderWidth: 4, height: 30, justifyContent: 'center', left: 27, position: 'absolute', top: 27, width: 30 },
  revealBallCore: { backgroundColor: Colors.captureReveal.cyan, borderRadius: 6, height: 12, shadowColor: Colors.captureReveal.cyan, shadowOpacity: 0.9, shadowRadius: 8, width: 12 },
  // Cartão final apresenta imagem, mensagem adequada à duplicidade e ação de consulta.
  noticeCard: { alignItems: 'center', backgroundColor: Colors.surface.captureNotice, borderColor: Colors.details, borderRadius: 34, borderWidth: 4, elevation: 16, maxWidth: 330, padding: 22, shadowColor: Colors.details, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.45, shadowRadius: 22, width: '84%' },
  noticeImage: { height: 128, marginTop: 2, width: 128 },
  noticeTitle: { color: Colors.title, fontSize: 21, fontWeight: '900', marginTop: 4, textAlign: 'center', textTransform: 'capitalize' },
  noticeButton: { borderRadius: 999, marginTop: 15 },
  permissionButton: { borderRadius: 14, marginTop: 22 },
});
