import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

import { Alert } from '@/components/alert';
import { Colors, getColor } from '@/constants/colors';
import { TYPE_COLORS, TYPE_ICONS } from '@/constants/pokemon';

import { styles } from './styles';
import { PokemonCardProps } from './types';

const STAT_ABBR: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.A',
  'special-defense': 'SP.D',
  speed: 'SPD',
};

export function PokemonCard({
  title,
  image,
  tipos = [],
  poderes = [],
  index,
  showDetailsButton = false,
}: PokemonCardProps) {
  const [visible, setVisible] = useState(false);
  const colors = getColor(tipos);
  const accentColor =
    TYPE_COLORS[tipos[0]] ?? colors.accent ?? Colors.details;
  const hp = poderes.find((poder) => poder.nome === 'hp')?.forca ?? 0;
  const topStats = useMemo(() => poderes.slice(1, 4), [poderes]);

  return (
    <View
      style={[
        styles.nativeCard,
        {
          borderColor: accentColor,
          shadowColor: accentColor,
        },
      ]}
    >
      <View style={styles.nativeImageShell}>
        <View
          style={[
            styles.nativeImageRing,
            {
              borderColor: accentColor,
              backgroundColor: `${accentColor}18`,
            },
          ]}
        >
          <Image source={image} style={styles.nativeImage} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.nativeContent}>
        <View style={styles.nativeTitleRow}>
          <Text style={styles.nativeTitle} numberOfLines={1}>
            {title}
          </Text>
          {index ? (
            <Text style={[styles.nativeIndex, { color: accentColor }]}>
              #{index}
            </Text>
          ) : null}
        </View>

        <View style={styles.nativeMetaRow}>
          <View style={styles.nativeHpPill}>
            <Text style={styles.nativeHpLabel}>HP</Text>
            <Text style={[styles.nativeHpValue, { color: accentColor }]}>
              {hp}
            </Text>
          </View>

          <View style={styles.nativeTypesRow}>
            {tipos.slice(0, 2).map((tipo) => (
              <View
                key={tipo}
                style={[
                  styles.nativeTypePill,
                  { borderColor: TYPE_COLORS[tipo] ?? accentColor },
                ]}
              >
                <Text
                  style={[
                    styles.nativeTypeText,
                    { color: TYPE_COLORS[tipo] ?? accentColor },
                  ]}
                  numberOfLines={1}
                >
                  {TYPE_ICONS[tipo]} {tipo}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.nativeStatsRow}>
          {topStats.map((poder) => (
            <View key={poder.nome} style={styles.nativeStatPill}>
              <Text style={styles.nativeStatName}>
                {STAT_ABBR[poder.nome] ?? poder.nome.slice(0, 3).toUpperCase()}
              </Text>
              <Text style={[styles.nativeStatValue, { color: accentColor }]}>
                {poder.forca}
              </Text>
            </View>
          ))}
        </View>

        {showDetailsButton ? (
          <Pressable
            style={[styles.nativeDetailsButton, { borderColor: accentColor }]}
            onPress={() => setVisible(true)}
          >
            <Text style={[styles.nativeDetailsText, { color: accentColor }]}>
              Ver detalhes
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Alert
        visible={visible}
        onClose={() => setVisible(false)}
        type="info"
        title={title}
        message={`Tipos: ${tipos.join(' | ')}\n\nPoderes: ${poderes
          .map((poder) => `${poder.nome}: ${poder.forca}`)
          .join(' | ')}`}
      />
    </View>
  );
}
