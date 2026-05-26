import { View, Text, Animated, ImageSourcePropType, Pressable, Platform, } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { styles } from './styles';
import { Alert } from '@/components/alert';
import { Poder } from '@/@types/pokemon';
import { TYPE_ICONS, TYPE_COLORS } from '@/constants/pokemon';

interface CardProps {
  title: string;
  description: string;
  image:
    | ImageSourcePropType
    | {
        uri: string;
      };
  tipos?: string[];
  poderes?: Poder[];
}

export function Card({
  title,
  description,
  image,
  tipos = [],
  poderes = [],
}: CardProps) {
  const [visible, setVisible] = useState(false);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* IMAGE */}
      <View style={styles.imageContainer}>
        <Animated.Image
          source={image}
          style={[
            styles.image,
            { transform: [{ translateY: floatAnim }] },
          ]}
        />
      </View>

      {/* TITLE */}
      <Text style={[styles.title, { textAlign: 'center' }]}>
        {title}
      </Text>

      {/* TYPES */}
      <View style={styles.tags}>
        {tipos.map((tipo) => {
          const color = TYPE_COLORS[tipo];

          return (
            <Pressable
              key={tipo}
              style={({ hovered }) => ({
                borderColor: color,
                backgroundColor:
                  Platform.OS === 'web' && hovered
                    ? color
                    : 'transparent',
                paddingVertical: 7,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1.5,
                minWidth: 80,
                alignItems: 'center',
              })}
            >
              {({ hovered }) => (
                <Text
                  style={{
                    color:
                      Platform.OS === 'web' && hovered
                        ? '#fff'
                        : color,
                    fontWeight: '700',
                    fontSize: 12,
                  }}
                >
                  {TYPE_ICONS[tipo]} {tipo}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* BUTTON */}
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>
          Ver detalhes
        </Text>
      </Pressable>

      {/* ALERT */}
      <Alert
        visible={visible}
        onClose={() => setVisible(false)}
        type="info"
        title={`🔎 ${title}`}
        message={`
═══════════════════════

TIPOS

${tipos
  .map((t) => `${TYPE_ICONS[t]} ${t}`)
  .join(' | ')}

═══════════════════════

PODERES

${poderes
  .map(
    (p) =>
      `⚡ ${p.nome.replace('-', ' ').toUpperCase()} (${p.forca})`
  )
  .join(' | ')}

═══════════════════════
`}
      />
    </Animated.View>
  );
}