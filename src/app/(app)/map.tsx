/*
 * Esta rota única escolhe a experiência de mapa adequada para cada plataforma.
 * Na web, mostra o histórico de capturas; no nativo, exibe o mapa interativo.
 * Ambas as variações preservam o mesmo destino autenticado /map.
 */
// Hooks organizam a lista derivada, a seleção e as adaptações de largura.
import type { ComponentProps } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Map as MapIcon, MapPin, Navigation, X } from 'lucide-react-native';
// Componentes e tipos de domínio apresentam o histórico sem duplicar regras da coleção.
import * as Location from 'expo-location';
import { CapturedPokemon } from '@/@types/collection';
import { Screen } from '@/components/screen';
import { Button } from '@/components/button';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { DetailsModal } from '@/components/detailsModal';
import { Heading } from '@/components/heading';
import { StateCard } from '@/components/stateCard';
import { Colors } from '@/constants/colors';
import { useCollection } from '@/context/CollectionContext';
import { formatCaptureDate } from '@/utils/formatCaptureDate';

function MapWeb() {
  const { width } = useWindowDimensions();
  const { captures, loading } = useCollection();
  const [selectedPokemon, setSelectedPokemon] = useState<CapturedPokemon | null>(null);
  // O modo compacto reorganiza cartões para caber em celulares sem reduzir a legibilidade.
  const isMobile = width < 560;
  // Uma cópia é ordenada para não modificar o array compartilhado pelo contexto.
  const chronologicalCaptures = useMemo(
    () =>
      [...captures].sort(
        (first, second) =>
          Date.parse(second.capturedAt) - Date.parse(first.capturedAt)
      ),
    [captures]
  );

  return (
    <Screen>
      <Header />

      <ScrollView contentContainerStyle={webStyles.scrollContent}>
        <Heading
          title="Mapa de Captura"
          subtitle="Todos os Pokémon da sua coleção, dos mais recentes aos mais antigos."
          icon={MapIcon}
          style={webStyles.heading}
        />

        {/* A região principal alterna entre carregamento, histórico e orientação para a primeira captura. */}
        <View style={[webStyles.list, isMobile && webStyles.listMobile]}>
          {loading ? (
            <StateCard
              message="Carregando suas capturas..."
              loading
              style={webStyles.loadingCard}
            />
          ) : chronologicalCaptures.length ? (
            chronologicalCaptures.map((pokemon) => (
              /* O cartão inteiro é acionável para facilitar a consulta em telas de toque. */
              <Pressable
                key={pokemon.index}
                style={({ pressed }) => [
                  webStyles.captureCard,
                  isMobile && webStyles.captureCardMobile,
                  pressed && webStyles.pressed,
                ]}
                onPress={() => setSelectedPokemon(pokemon)}
              >
                <View style={[webStyles.imageFrame, isMobile && webStyles.imageFrameMobile]}>
                  <Image
                    source={{ uri: pokemon.imagem }}
                    style={webStyles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={webStyles.captureInfo}>
                  <Text style={webStyles.index}>#{pokemon.index.toString().padStart(3, '0')}</Text>
                  <Text style={webStyles.name}>{pokemon.nome}</Text>
                  <Text style={webStyles.date}>{formatCaptureDate(pokemon.capturedAt)}</Text>
                  <View
                    style={[
                      webStyles.locationBadge,
                      !pokemon.location && webStyles.locationBadgeMissing,
                    ]}
                  >
                    <MapPin
                      size={14}
                      color={pokemon.location ? Colors.label : Colors.gray[500]}
                    />
                    <Text
                      style={[
                        webStyles.locationText,
                        !pokemon.location && webStyles.locationTextMissing,
                      ]}
                    >
                      {pokemon.location ? 'Localização registrada' : 'Sem localização'}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    webStyles.detailsButton,
                    isMobile && webStyles.detailsButtonMobile,
                  ]}
                >
                  <Text style={webStyles.detailsButtonText}>Ver Pokémon</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <StateCard
              title="Seu histórico ainda está vazio"
              message="Use a câmera no aplicativo para escanear um QR Code. Sua próxima captura aparecerá aqui com a data e a localização disponível."
              icon={
                <View style={webStyles.emptyIcon}>
                  <MapIcon size={34} color={Colors.title} />
                </View>
              }
              style={webStyles.emptyCard}
            />
          )}
        </View>

        {/* O rodapé encerra o conteúdo rolável depois de qualquer estado da lista. */}
        <Footer />
      </ScrollView>

      {/* A seleção abre detalhes sem perder a posição atual no histórico. */}
      <DetailsModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </Screen>
  );
}

// react-native-webview deve ser resolvido apenas no runtime nativo.
declare const require: <T = unknown>(moduleName: string) => T;

type ReactNativeWebViewModule = typeof import('react-native-webview');

function NativeWebView(props: ComponentProps<ReactNativeWebViewModule['WebView']>) {
  const { WebView } = require<ReactNativeWebViewModule>('react-native-webview');
  return <WebView {...props} />;
}

export default function TrainerMapPage() {
  return Platform.OS === 'web' ? <MapWeb /> : <NativeMap />;
}

const webStyles = StyleSheet.create({
  // Estrutura geral da página, incluindo limite de largura e espaçamento responsivo da lista.
  scrollContent: { flexGrow: 1 },
  heading: { paddingTop: 28 },
  list: {
    alignSelf: 'center',
    flex: 1,
    gap: 14,
    maxWidth: 900,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
  },
  listMobile: { paddingHorizontal: 14, paddingVertical: 20 },
  // Cartão de captura e sua reorganização quando a largura é limitada.
  captureCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
    borderRadius: 22,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 18,
    padding: 14,
  },
  captureCardMobile: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    padding: 11,
  },
  pressed: { opacity: 0.7 },
  // Imagem e textos dão hierarquia ao número, nome e data da captura.
  imageFrame: {
    alignItems: 'center',
    backgroundColor: Colors.imageBackground,
    borderRadius: 18,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  image: { height: '92%', width: '92%' },
  imageFrameMobile: { height: 88, width: 88 },
  captureInfo: { flex: 1, justifyContent: 'center', minWidth: 0 },
  index: { color: Colors.label, fontSize: 12, fontWeight: '900' },
  name: { color: Colors.text, fontSize: 21, fontWeight: '900', textTransform: 'capitalize' },
  date: { color: Colors.subtitle, fontSize: 13, fontWeight: '700', marginTop: 3 },
  // Selo diferencia rapidamente capturas com coordenadas das que não têm localização.
  locationBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.map.locationBadge,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  locationBadgeMissing: { backgroundColor: Colors.gray[100] },
  locationText: { color: Colors.label, fontSize: 12, fontWeight: '800' },
  locationTextMissing: { color: Colors.gray[500] },
  // Chamada visual para abrir detalhes, com largura total no modo móvel.
  detailsButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    minWidth: 108,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  detailsButtonMobile: { width: '100%' },
  detailsButtonText: { color: Colors.white, fontSize: 13, fontWeight: '900', textAlign: 'center' },
  // Estados de carregamento e vazio ocupam espaço suficiente para orientar sem parecer um cartão comum.
  loadingCard: {
    maxWidth: '100%',
    paddingVertical: 70,
    borderWidth: 0,
    backgroundColor: Colors.alpha.transparentWhite,
  },
  emptyCard: {
    alignSelf: 'center',
    borderRadius: 24,
    padding: 28,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: Colors.map.emptyIcon,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
});


// Altura fixa oferece uma área útil de navegação sem ocupar toda a página rolável.
const MAP_HEIGHT = 380;

// O mapa precisa apenas das coordenadas atuais e da precisão reportada pelo aparelho.
type CurrentPosition = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

// Mensagens tipadas limitam a comunicação da página incorporada a marcador ou agrupamento.
type MapMessage =
  | { type: 'marker'; id: string }
  | { type: 'cluster'; ids: string[] };

// Escapa caracteres que poderiam encerrar ou alterar o script ao inserir dados no HTML.
function serializeForInlineScript(value: unknown) {
  return JSON.stringify(value)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

// Gera um documento Leaflet isolado: ele desenha pontos e devolve cliques ao React Native.
function createMapHtml(
  captures: CapturedPokemon[],
  position: CurrentPosition | null
) {
  // Só chegam capturas localizadas, portanto as coordenadas podem ser serializadas com segurança.
  const points = captures.map((capture) => ({
    id: capture.index,
    latitude: capture.location!.latitude,
    longitude: capture.location!.longitude,
  }));
  const serializedPoints = serializeForInlineScript(points);
  const serializedPosition = serializeForInlineScript(position);

  // O cabeçalho restringe origens externas e carrega Leaflet/OpenStreetMap; os estilos distinguem
  // captura, agrupamento e posição atual. No script, falhas de mapa/tiles recebem mensagens próprias,
  // cliques são enviados à WebView, marcadores próximos viram clusters e o enquadramento final inclui
  // todos os pontos disponíveis, usando São Paulo apenas quando ainda não existe nenhuma coordenada.
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' https://unpkg.com; style-src 'unsafe-inline' https://unpkg.com; img-src data: https://unpkg.com https://*.tile.openstreetmap.org; connect-src https://*.tile.openstreetmap.org;" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" crossorigin="anonymous" />
  <style>
    html, body, #map { width: 100%; height: 100%; margin: 0; background: ${Colors.map.background}; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    #status {
      position: absolute; inset: 0; z-index: 1000; display: flex; align-items: center;
      justify-content: center; padding: 24px; box-sizing: border-box; color: ${Colors.map.mutedText};
      background: ${Colors.map.background}; font-size: 14px; font-weight: 700; text-align: center;
    }
    #status.warning { inset: auto 12px 12px; border: 1px solid ${Colors.inputBorder}; border-radius: 12px;
      background: ${Colors.alpha.white95}; color: ${Colors.map.subduedText}; }
    .capture-marker { width: 22px; height: 22px; border: 3px solid ${Colors.white}; border-radius: 50% 50% 50% 0;
      background: ${Colors.title}; box-shadow: 0 2px 7px ${Colors.alpha.black28}; transform: rotate(-45deg); }
    .cluster-marker { display: flex; align-items: center; justify-content: center; min-width: 136px;
      height: 34px; padding: 0 10px; box-sizing: border-box; border: 3px solid ${Colors.white};
      border-radius: 18px; background: ${Colors.title}; color: ${Colors.white}; box-shadow: 0 2px 8px ${Colors.alpha.black25};
      font-size: 11px; font-weight: 900; white-space: nowrap; }
    .current-position { width: 18px; height: 18px; box-sizing: border-box; border: 4px solid ${Colors.white};
      border-radius: 50%; background: ${Colors.map.currentPosition}; box-shadow: 0 0 0 2px ${Colors.map.currentPosition}, 0 2px 7px ${Colors.alpha.black28}; }
    .leaflet-control-attribution { color: ${Colors.map.subduedText}; background: ${Colors.alpha.white88} !important; }
  </style>
</head>
<body>
  <div id="map" role="application" aria-label="Mapa das capturas"></div>
  <div id="status">Carregando mapa...</div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js" crossorigin="anonymous"></script>
  <script>
    (function () {
      var points = ${serializedPoints};
      var position = ${serializedPosition};
      var status = document.getElementById('status');

      function showFailure(message, warning) {
        status.textContent = message;
        status.className = warning ? 'warning' : '';
        status.style.display = 'flex';
      }

      function post(payload) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      }

      try {
        if (!window.L || !L.markerClusterGroup) {
          throw new Error('Leaflet indisponível');
        }

        var map = L.map('map', { zoomControl: true });
        var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        });
        var tileErrors = 0;
        tiles.on('load', function () { status.style.display = 'none'; });
        tiles.on('tileerror', function () {
          tileErrors += 1;
          if (tileErrors === 1) {
            showFailure('O mapa base não pôde ser carregado. Os marcadores continuam disponíveis.', true);
          }
        });
        tiles.addTo(map);

        var captureIcon = L.divIcon({ className: '', html: '<div class="capture-marker"></div>', iconSize: [28, 28], iconAnchor: [14, 26] });
        var clusters = L.markerClusterGroup({
          zoomToBoundsOnClick: false,
          spiderfyOnMaxZoom: false,
          showCoverageOnHover: false,
          iconCreateFunction: function (cluster) {
            var count = cluster.getChildCount();
            return L.divIcon({
              className: '',
              html: '<div class="cluster-marker">' + count + ' Pokémon nesta área</div>',
              iconSize: [136, 34],
              iconAnchor: [68, 17]
            });
          }
        });

        points.forEach(function (point) {
          var marker = L.marker([point.latitude, point.longitude], { icon: captureIcon });
          marker.captureId = point.id;
          marker.on('click', function () { post({ type: 'marker', id: point.id }); });
          clusters.addLayer(marker);
        });
        clusters.on('clusterclick', function (event) {
          var ids = event.layer.getAllChildMarkers().map(function (marker) { return marker.captureId; });
          post({ type: 'cluster', ids: ids });
        });
        map.addLayer(clusters);

        var bounds = points.map(function (point) { return [point.latitude, point.longitude]; });
        if (position) {
          var currentIcon = L.divIcon({ className: '', html: '<div class="current-position"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
          L.marker([position.latitude, position.longitude], { icon: currentIcon, zIndexOffset: 1000 })
            .bindTooltip('Sua posição atual')
            .addTo(map);
          if (position.accuracy) {
            L.circle([position.latitude, position.longitude], {
              radius: position.accuracy,
              color: '${Colors.map.currentPosition}',
              fillColor: '${Colors.map.currentPosition}',
              fillOpacity: 0.1,
              weight: 1
            }).addTo(map);
          }
          bounds.push([position.latitude, position.longitude]);
        }

        if (bounds.length > 1) {
          map.fitBounds(bounds, { padding: [42, 42], maxZoom: 16 });
        } else if (bounds.length === 1) {
          map.setView(bounds[0], 15);
        } else {
          map.setView([-23.55052, -46.633308], 12);
        }
      } catch (error) {
        showFailure('Não foi possível carregar o mapa agora. Verifique sua conexão e tente novamente.', false);
      }
    })();
  </script>
</body>
</html>`;
}

function NativeMap() {
  const { captures, loading } = useCollection();
  // Estados separam GPS, falha da página e os dois níveis de detalhe selecionáveis no mapa.
  const [position, setPosition] = useState<CurrentPosition | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [webViewFailed, setWebViewFailed] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<CapturedPokemon | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<CapturedPokemon[] | null>(null);
  const [message, setMessage] = useState('Solicitando acesso à sua localização...');

  // Listas derivadas evitam refiltrar a coleção em cada renderização e alimentam regiões distintas.
  const locatedCaptures = useMemo(
    () => captures.filter((capture) => capture.location),
    [captures]
  );
  const unlocatedCaptures = useMemo(
    () => captures.filter((capture) => !capture.location),
    [captures]
  );
  // O mapa por id converte rapidamente mensagens da WebView de volta em objetos completos.
  const capturesById = useMemo(
    () => new Map(captures.map((capture) => [capture.index, capture])),
    [captures]
  );
  // O documento só é reconstruído quando marcadores ou posição realmente mudam.
  const mapHtml = useMemo(
    () => createMapHtml(locatedCaptures, position),
    [locatedCaptures, position]
  );

  // Solicita GPS de forma tolerante: falhas afetam a posição atual, não as capturas já registradas.
  const locateUser = useCallback(async () => {
    setLoadingLocation(true);
    setMessage('Buscando sua localização atual...');

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();

      // Mensagens específicas ajudam a distinguir GPS desligado de permissão recusada.
      if (!servicesEnabled) {
        setMessage('Ative o GPS do aparelho para ver sua posição no mapa.');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        setMessage(
          'A localização não foi autorizada. Você pode permitir o acesso nas configurações do aparelho.'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setPosition({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      });
      setMessage('Sua posição atual está marcada no mapa.');
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setMessage(
        'Não foi possível obter sua localização agora. Confira o sinal do GPS.'
      );
    } finally {
      // Encerra o indicador em todos os caminhos, inclusive retornos antecipados dentro do try.
      setLoadingLocation(false);
    }
  }, []);

  // A primeira montagem inicia a localização sem bloquear a renderização do restante da tela.
  useEffect(() => {
    void locateUser();
  }, [locateUser]);

  // Valida a mensagem da página antes de abrir detalhes ou listar um agrupamento de marcadores.
  const handleMapMessage = useCallback(
    (rawMessage: string) => {
      try {
        const mapMessage = JSON.parse(rawMessage) as MapMessage;

        // Um marcador individual abre diretamente o Pokémon correspondente.
        if (mapMessage.type === 'marker' && typeof mapMessage.id === 'string') {
          const pokemon = capturesById.get(mapMessage.id);
          if (pokemon?.location) setSelectedPokemon(pokemon);
          return;
        }

        // Um cluster mantém apenas ids válidos e ainda associados a capturas localizadas.
        if (mapMessage.type === 'cluster' && Array.isArray(mapMessage.ids)) {
          const clusterCaptures = mapMessage.ids
            .filter((id): id is string => typeof id === 'string')
            .map((id) => capturesById.get(id))
            .filter((pokemon): pokemon is CapturedPokemon => Boolean(pokemon?.location));

          if (clusterCaptures.length) setSelectedCluster(clusterCaptures);
        }
      } catch {
        // Mensagens malformadas da página incorporada são ignoradas para proteger a tela nativa.
      }
    },
    [capturesById]
  );

  // Fecha um modal antes de abrir o outro para evitar sobreposição e conflitos de animação.
  const openDetailsFromCluster = (pokemon: CapturedPokemon) => {
    setSelectedCluster(null);
    setTimeout(() => setSelectedPokemon(pokemon), 0);
  };
  // A precisão é opcional porque alguns provedores de localização não a informam.
  const accuracyLabel = position?.accuracy
    ? `Precisão aproximada de ${Math.round(position.accuracy)} m`
    : null;

  return (
    <Screen>
      <View style={nativeStyles.content}>
        <Header />
        <ScrollView contentContainerStyle={nativeStyles.scrollContent}>
          <Heading
            title="Mapa de Captura"
            subtitle="Revise onde cada Pokémon da sua coleção foi capturado."
            variant="compact"
            icon={MapIcon}
            style={nativeStyles.heading}
          />

          {/* O cartão reúne mapa e situação do GPS como uma única experiência contextual. */}
          <View style={nativeStyles.mapCard}>
            <View style={nativeStyles.map}>
              {/* Se a página externa falhar, uma explicação substitui a área sem derrubar a tela. */}
              {webViewFailed ? (
                <View style={nativeStyles.mapFallback}>
                  <MapIcon size={28} color={Colors.title} />
                  <Text style={nativeStyles.mapFallbackTitle}>Mapa indisponível</Text>
                  <Text style={nativeStyles.mapFallbackText}>
                    Não foi possível carregar o mapa agora. Verifique sua conexão.
                  </Text>
                </View>
              ) : (
                <NativeWebView
                  source={{ html: mapHtml }}
                  style={nativeStyles.webView}
                  containerStyle={nativeStyles.webViewContainer}
                  originWhitelist={['*']}
                  javaScriptEnabled
                  domStorageEnabled={false}
                  scrollEnabled={false}
                  setBuiltInZoomControls={false}
                  onMessage={({ nativeEvent }) => handleMapMessage(nativeEvent.data)}
                  onError={() => setWebViewFailed(true)}
                  onHttpError={() => setWebViewFailed(true)}
                />
              )}
            </View>

            {/* Este painel informa se o aparelho foi localizado e qual precisão está disponível. */}
            <View style={nativeStyles.statusPanel}>
              <View style={nativeStyles.statusIcon}>
                {loadingLocation ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  <Navigation size={20} color={Colors.primary} fill={Colors.primary} />
                )}
              </View>
              <View style={nativeStyles.statusText}>
                <Text style={nativeStyles.statusTitle}>
                  {position ? 'Localização encontrada' : 'Localização do aparelho'}
                </Text>
                <Text style={nativeStyles.statusDescription}>{message}</Text>
                {accuracyLabel && <Text style={nativeStyles.accuracy}>{accuracyLabel}</Text>}
              </View>
            </View>
          </View>

          {/* Capturas sem coordenadas permanecem acessíveis mesmo não podendo virar marcadores. */}
          <View style={nativeStyles.unlocatedSection}>
            <Text style={nativeStyles.sectionTitle}>Capturas sem localização</Text>
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={nativeStyles.sectionLoader} />
            ) : unlocatedCaptures.length ? (
              unlocatedCaptures.map((pokemon) => (
                <Pressable
                  key={pokemon.index}
                  style={({ pressed }) => [
                    nativeStyles.captureRow,
                    pressed && nativeStyles.pressed,
                  ]}
                  onPress={() => setSelectedPokemon(pokemon)}
                >
                  <Image source={{ uri: pokemon.imagem }} style={nativeStyles.captureImage} />
                  <View style={nativeStyles.captureInfo}>
                    <Text style={nativeStyles.captureName}>{pokemon.nome}</Text>
                    <Text style={nativeStyles.captureDate}>
                      Capturado em {formatCaptureDate(pokemon.capturedAt)}
                    </Text>
                  </View>
                  <Text style={nativeStyles.viewAction}>Ver</Text>
                </Pressable>
              ))
            ) : (
              <Text style={nativeStyles.emptySectionText}>
                Todas as suas capturas têm localização registrada.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Clusters abrem uma lista intermediária para o usuário escolher o marcador desejado. */}
      <Modal
        visible={Boolean(selectedCluster)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCluster(null)}
      >
        <View style={nativeStyles.modalBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSelectedCluster(null)}
            accessibilityLabel="Fechar lista de Pokémon"
          />
          <View style={nativeStyles.clusterModal}>
            <View style={nativeStyles.modalHeader}>
              <View>
                <Text style={nativeStyles.modalTitle}>
                  {selectedCluster?.length} Pokémon nesta área
                </Text>
                <Text style={nativeStyles.modalSubtitle}>Escolha um para ver os detalhes.</Text>
              </View>
              <Pressable
                style={nativeStyles.closeButton}
                onPress={() => setSelectedCluster(null)}
                accessibilityLabel="Fechar"
              >
                <X size={22} color={Colors.text} />
              </Pressable>
            </View>
            <ScrollView style={nativeStyles.clusterList}>
              {selectedCluster?.map((pokemon) => (
                <View key={pokemon.index} style={nativeStyles.modalPokemonRow}>
                  <Image source={{ uri: pokemon.imagem }} style={nativeStyles.modalImage} />
                  <View style={nativeStyles.captureInfo}>
                    <Text style={nativeStyles.captureName}>{pokemon.nome}</Text>
                    <Text style={nativeStyles.captureDate}>
                      {formatCaptureDate(pokemon.capturedAt)}
                    </Text>
                  </View>
                  <Button
                    title="Ver Pokémon"
                    size="small"
                    fullWidth={false}
                    onPress={() => openDetailsFromCluster(pokemon)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* O modal final reutiliza os detalhes tanto de listas quanto de marcadores individuais. */}
      <DetailsModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </Screen>
  );
}

const nativeStyles = StyleSheet.create({
  // Base da página rolável e afastamento do título.
  content: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  heading: {
    marginTop: 26,
    marginBottom: 20,
  },
  // Moldura do mapa, área da WebView e fallback para falhas de rede ou carregamento.
  mapCard: {
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
    borderRadius: 28,
    borderWidth: 2,
    marginHorizontal: 20,
    maxWidth: 760,
    overflow: 'hidden',
    padding: 12,
    width: '90%',
  },
  map: {
    backgroundColor: Colors.map.background,
    borderRadius: 18,
    height: MAP_HEIGHT,
    overflow: 'hidden',
    width: '100%',
  },
  webView: { backgroundColor: Colors.map.background },
  webViewContainer: { backgroundColor: Colors.map.background },
  mapFallback: {
    alignItems: 'center',
    backgroundColor: Colors.map.background,
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  mapFallbackTitle: { color: Colors.text, fontSize: 17, fontWeight: '900', marginTop: 10 },
  mapFallbackText: {
    color: Colors.subtitle,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 5,
    textAlign: 'center',
  },
  // Painel de status organiza ícone, mensagem de GPS e precisão abaixo do mapa.
  statusPanel: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: Colors.map.locationBadge,
    borderRadius: 18,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  statusText: { flex: 1 },
  statusTitle: { color: Colors.text, fontSize: 15, fontWeight: '800' },
  statusDescription: { color: Colors.subtitle, fontSize: 13, lineHeight: 18, marginTop: 2 },
  accuracy: { color: Colors.label, fontSize: 12, fontWeight: '700', marginTop: 4 },
  // Seção e linhas permitem consultar capturas que não possuem coordenadas.
  unlocatedSection: {
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
    borderRadius: 24,
    borderWidth: 2,
    marginTop: 20,
    maxWidth: 760,
    padding: 18,
    width: '90%',
  },
  sectionTitle: { color: Colors.title, fontSize: 18, fontWeight: '900', marginBottom: 12 },
  sectionLoader: { marginVertical: 12 },
  captureRow: {
    alignItems: 'center',
    borderTopColor: Colors.inputBorder,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  captureImage: { backgroundColor: Colors.imageBackground, borderRadius: 14, height: 58, width: 58 },
  captureInfo: { flex: 1 },
  captureName: { color: Colors.text, fontSize: 15, fontWeight: '900', textTransform: 'capitalize' },
  captureDate: { color: Colors.subtitle, fontSize: 12, fontWeight: '700', marginTop: 3 },
  viewAction: { color: Colors.title, fontSize: 13, fontWeight: '900' },
  emptySectionText: { color: Colors.subtitle, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  pressed: { opacity: 0.65 },
  // Fundo e caixa modal isolam a seleção quando vários Pokémon ocupam a mesma área.
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: Colors.alpha.black55,
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  clusterModal: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    maxHeight: '75%',
    maxWidth: 620,
    padding: 18,
    width: '100%',
  },
  modalHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  modalTitle: { color: Colors.title, fontSize: 20, fontWeight: '900' },
  modalSubtitle: { color: Colors.subtitle, fontSize: 13, fontWeight: '700', marginTop: 3 },
  // Botão de fechar e lista interna mantêm controles e itens acessíveis em pouco espaço.
  closeButton: {
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  clusterList: { marginTop: 12 },
  modalPokemonRow: {
    alignItems: 'center',
    borderTopColor: Colors.inputBorder,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 9,
    paddingVertical: 10,
  },
  modalImage: { backgroundColor: Colors.imageBackground, borderRadius: 12, height: 52, width: 52 },
});
