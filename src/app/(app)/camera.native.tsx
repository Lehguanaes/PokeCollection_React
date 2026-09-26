import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, QrCode } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Background } from '@/components/background';
import { Header } from '@/components/header';
import { Menu } from '@/components/menu';
import { Colors } from '@/constants/colors';
import { getPokemonById } from '@/integration/pokemonIntegration';
import { saveCapturedPokemon } from '@/integration/capturedPokemonStorage';
import { Pokemon } from '@/@types/pokemon';

const IDLE_MESSAGE = 'Procurando QR Code para capturar um Pokémon.';

function getPokemonId(code: string) {
  const id = Number(code.trim().match(/\d+/)?.[0]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default function CameraCapture() {
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [message, setMessage] = useState(IDLE_MESSAGE);
  const [captureNotice, setCaptureNotice] = useState<Pokemon | null>(null);
  const [lastCapturedPokemon, setLastCapturedPokemon] = useState<Pokemon | null>(null);
  const [wasAlreadyCaptured, setWasAlreadyCaptured] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  function showCaptureNotice(pokemon: Pokemon) {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);

    setCaptureNotice(pokemon);
    noticeTimer.current = setTimeout(() => {
      setCaptureNotice(null);
      noticeTimer.current = null;
    }, 4000);
  }

  async function capturePokemon(code: string) {
    if (isProcessing || code === lastScannedCode) return;

    const pokemonId = getPokemonId(code);
    setLastScannedCode(code);

    if (!pokemonId) {
      setMessage('Esse QR Code não contém um número de Pokémon válido.');
      return;
    }

    setIsProcessing(true);
    setMessage('Processando...');

    try {
      const pokemon = await getPokemonById(pokemonId);
      const result = await saveCapturedPokemon(pokemon);
      setLastCapturedPokemon(pokemon);
      setWasAlreadyCaptured(result === 'duplicate');

      if (result === 'duplicate') {
        setMessage(`${pokemon.nome} já está na sua Pokédex.`);
      } else {
        setMessage('Pokémon capturado com sucesso.');
      }

      showCaptureNotice(pokemon);
    } catch {
      setMessage('Não foi possível capturar esse Pokémon. Confira o QR Code e tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Camera size={48} color={Colors.title} />
        <Text style={styles.permissionTitle}>Permita usar a câmera</Text>
        <Text style={styles.permissionText}>
          A câmera será usada somente para ler o QR Code de um Pokémon.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => void requestPermission()}>
          <Text style={styles.primaryButtonText}>Permitir câmera</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Background />
      {!isMobile && <Menu />}
      <View style={styles.content}>
        <Header />
        <View style={styles.heading}>
          <View style={styles.titleRow}>
            <QrCode size={27} color={Colors.title} />
            <Text style={styles.title}>Capturar Pokémon</Text>
          </View>
          <Text style={styles.subtitle}>
            Escaneie um QR Code que contenha o número do Pokémon.
          </Text>
        </View>

        <View style={styles.cameraCard}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={({ data }) => void capturePokemon(data)}
          />
          <View style={styles.scannerFrame} pointerEvents="none" />
        </View>

        <View style={styles.statusCard}>
          {isProcessing ? <ActivityIndicator color={Colors.primary} /> : <QrCode size={20} color={Colors.primary} />}
          <View style={styles.statusContent}>
            <Text style={styles.statusText}>{message}</Text>
            {lastCapturedPokemon ? (
              <Pressable
                style={styles.viewPokemonButton}
                onPress={() => router.push('/pokedex')}
              >
                <Text style={styles.viewPokemonText}>Ver {lastCapturedPokemon.nome}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      {captureNotice ? (
        <View style={styles.noticeOverlay} pointerEvents="box-none">
          <View style={styles.noticeCard}>
            <Image
              source={{ uri: captureNotice.imagem }}
              style={styles.noticeImage}
              resizeMode="contain"
            />
            <Text style={styles.noticeTitle}>
              {wasAlreadyCaptured
                ? `${captureNotice.nome} já está na Pokédex!`
                : `${captureNotice.nome} capturado!`}
            </Text>
            <Pressable
              style={styles.noticeButton}
              onPress={() => router.push('/pokedex')}
            >
              <Text style={styles.noticeButtonText}>Ver {captureNotice.nome}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1 },
  center: { alignItems: 'center', backgroundColor: Colors.background, flex: 1, justifyContent: 'center', padding: 28 },
  permissionTitle: { color: Colors.title, fontSize: 26, fontWeight: '900', marginTop: 18 },
  permissionText: { color: Colors.subtitle, fontSize: 16, lineHeight: 23, marginTop: 10, maxWidth: 350, textAlign: 'center' },
  heading: { alignItems: 'center', marginBottom: 18, marginTop: 22, paddingHorizontal: 20 },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  title: { color: Colors.title, fontSize: 27, fontWeight: '900' },
  subtitle: { color: Colors.subtitle, fontSize: 14, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  cameraCard: { alignSelf: 'center', backgroundColor: Colors.black, borderColor: Colors.white, borderRadius: 28, borderWidth: 3, maxWidth: 560, overflow: 'hidden', width: '88%' },
  camera: { aspectRatio: 0.76, maxHeight: 440, width: '100%' },
  scannerFrame: { borderColor: Colors.primary, borderRadius: 22, borderWidth: 3, height: '54%', left: '15%', position: 'absolute', top: '23%', width: '70%' },
  statusCard: { alignItems: 'center', alignSelf: 'center', backgroundColor: Colors.white, borderColor: Colors.inputBorder, borderRadius: 18, borderWidth: 2, flexDirection: 'row', gap: 10, marginTop: 18, maxWidth: 560, padding: 15, width: '88%' },
  statusContent: { flex: 1 },
  statusText: { color: Colors.subtitle, fontSize: 14, fontWeight: '800', lineHeight: 20 },
  viewPokemonButton: { alignSelf: 'flex-start', backgroundColor: Colors.primary, borderRadius: 999, marginTop: 9, paddingHorizontal: 12, paddingVertical: 7 },
  viewPokemonText: { color: Colors.white, fontSize: 12, fontWeight: '900', textTransform: 'capitalize' },
  noticeOverlay: { alignItems: 'center', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0 },
  noticeCard: { alignItems: 'center', backgroundColor: Colors.white, borderColor: Colors.primary, borderRadius: 28, borderWidth: 3, elevation: 12, maxWidth: 310, padding: 22, shadowColor: Colors.black, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, width: '78%' },
  noticeImage: { height: 138, width: 138 },
  noticeTitle: { color: Colors.title, fontSize: 23, fontWeight: '900', marginTop: 8, textAlign: 'center', textTransform: 'capitalize' },
  noticeButton: { backgroundColor: Colors.primary, borderRadius: 999, marginTop: 15, paddingHorizontal: 16, paddingVertical: 10 },
  noticeButtonText: { color: Colors.white, fontSize: 13, fontWeight: '900', textTransform: 'capitalize' },
  primaryButton: { alignItems: 'center', backgroundColor: Colors.primary, borderRadius: 14, flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 22, paddingHorizontal: 18, paddingVertical: 13 },
  primaryButtonText: { color: Colors.white, fontSize: 14, fontWeight: '900' },
});
