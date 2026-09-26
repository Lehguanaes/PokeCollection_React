import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';
import { Crosshair, MapPin, Navigation } from 'lucide-react-native';
import { Background } from '@/components/background';
import { Header } from '@/components/header';
import { Menu } from '@/components/menu';
import { Colors } from '@/constants/colors';

const DEFAULT_REGION: Region = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

type CurrentPosition = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const [position, setPosition] = useState<CurrentPosition | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [message, setMessage] = useState(
    'Solicitando acesso à sua localização...'
  );

  const locateUser = useCallback(async () => {
    setLoadingLocation(true);
    setMessage('Buscando sua localização atual...');

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();

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
      const nextPosition = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      };
      const nextRegion = {
        ...nextPosition,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      };

      setPosition(nextPosition);
      setMessage('Sua posição atual está marcada no mapa.');
      mapRef.current?.animateToRegion(nextRegion, 500);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setMessage(
        'Não foi possível obter sua localização agora. Confira o sinal do GPS e tente novamente.'
      );
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    void locateUser();
  }, [locateUser]);

  const accuracyLabel = position?.accuracy
    ? `Precisão aproximada de ${Math.round(position.accuracy)} m`
    : null;

  return (
    <View style={styles.wrapper}>
      <Background />
      <Menu />

      <View style={styles.content}>
        <Header />

        <View style={styles.heading}>
          <View style={styles.titleRow}>
            <MapPin size={28} color={Colors.title} fill={Colors.title} />
            <Text style={styles.title}>Mapa do Treinador</Text>
          </View>
          <Text style={styles.subtitle}>
            Encontre sua localização atual usando o GPS do aparelho.
          </Text>
        </View>

        <View style={styles.mapCard}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={DEFAULT_REGION}
            showsUserLocation={Boolean(position)}
            showsMyLocationButton
            loadingEnabled
            onMapReady={() => {
              if (position) {
                mapRef.current?.animateToRegion(
                  {
                    ...position,
                    latitudeDelta: 0.012,
                    longitudeDelta: 0.012,
                  },
                  0
                );
              }
            }}
          >
            {position && (
              <Marker coordinate={position} title="Você está aqui" pinColor={Colors.title} />
            )}
          </MapView>

          <View style={styles.statusPanel}>
            <View style={styles.statusIcon}>
              {loadingLocation ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Navigation size={20} color={Colors.primary} fill={Colors.primary} />
              )}
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                {position ? 'Localização encontrada' : 'Localização do aparelho'}
              </Text>
              <Text style={styles.statusDescription}>{message}</Text>
              {accuracyLabel && <Text style={styles.accuracy}>{accuracyLabel}</Text>}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.refreshButton,
              (pressed || loadingLocation) && styles.refreshButtonPressed,
            ]}
            onPress={() => void locateUser()}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Crosshair size={20} color={Colors.white} />
            )}
            <Text style={styles.refreshButtonText}>
              {position ? 'Atualizar localização' : 'Usar minha localização'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  heading: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 26,
    marginBottom: 20,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    color: Colors.title,
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: Colors.subtitle,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
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
    borderRadius: 18,
    height: '62%',
    minHeight: 300,
    overflow: 'hidden',
    width: '100%',
  },
  statusPanel: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: '#EAF8F3',
    borderRadius: 18,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  statusDescription: {
    color: Colors.subtitle,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  accuracy: {
    color: Colors.label,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 14,
  },
  refreshButtonPressed: {
    opacity: 0.65,
  },
  refreshButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
});
