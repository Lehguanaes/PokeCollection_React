/*
 * Implementa o cartão público de Pokémon usado no Android.
 * É selecionado pelo módulo Card e compartilhado com o iOS.
 * Resume imagem, tipos, atributos e ações em um layout de toque.
 */
import { useMemo } from 'react';
import {
  Image,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/button';
import { Colors, getColor, withAlpha } from '@/constants/colors';
import { STAT_ABBR, TYPE_COLORS, TYPE_ICONS, TYPE_MAP } from '@/constants/pokemon';

import { styles } from './styles.native';
import { CardProps } from './types';

export function Card({
  pokemon,
  footerActions,
  onPressDetails,
}: CardProps) {
  // Adapta o modelo recebido da API para os nomes portugueses usados pela camada visual.
  const { imagem, index, nome, poderes, tipos: apiTypes } = pokemon;
  const tipos = apiTypes.map((type) => TYPE_MAP[type] ?? type);
  // A primeira tipagem localizada dirige bordas e destaques, com reservas para dados desconhecidos.
  const colors = getColor(tipos);
  const accentColor =
    TYPE_COLORS[tipos[0]] ?? colors.accent ?? Colors.details;
  const hp = poderes.find((poder) => poder.nome === 'hp')?.forca ?? 0;
  // O resumo nativo limita a densidade a três atributos após HP para caber no cartão horizontal.
  const topStats = useMemo(() => poderes.slice(1, 4), [poderes]);

  return (
    // A implementação nativa evita hover e animações contínuas da versão web, priorizando toque e desempenho.
    <View
      style={[
        styles.nativeCard,
        {
          borderColor: accentColor,
          shadowColor: accentColor,
        },
      ]}
    >
      {/* Retrato: o anel translúcido deriva da cor principal sem introduzir uma paleta paralela. */}
      <View style={styles.nativeImageShell}>
        <View
          style={[
            styles.nativeImageRing,
            {
              borderColor: accentColor,
              backgroundColor: withAlpha(accentColor, 0.09),
            },
          ]}
        >
          <Image source={{ uri: imagem }} style={styles.nativeImage} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.nativeContent}>
        {/* Identidade: mantém nome e índice legíveis em uma única linha do layout compacto. */}
        <View style={styles.nativeTitleRow}>
          <Text style={styles.nativeTitle} numberOfLines={1}>
            {nome}
          </Text>
          {index ? (
            <Text style={[styles.nativeIndex, { color: accentColor }]}>
              #{Number(index)}
            </Text>
          ) : null}
        </View>

        {/* Metadados: resume HP e no máximo dois tipos, cada um com ícone e cor do domínio. */}
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

        {/* Atributos: exibe uma amostra compacta usando abreviações conhecidas ou uma reserva calculada. */}
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

        {/* Ações: encaminha o Pokémon completo ao consumidor e preserva extensões fornecidas no rodapé. */}
        {onPressDetails || footerActions ? (
          <View style={styles.nativeActionsRow}>
            {onPressDetails ? (
              <Button
                title="Ver detalhes"
                variant="secondary"
                size="small"
                fullWidth={false}
                style={[styles.nativeDetailsButton, { borderColor: accentColor }]}
                textStyle={[styles.nativeDetailsText, { color: accentColor }]}
                onPress={() => onPressDetails(pokemon)}
                accessibilityLabel={`Ver detalhes de ${nome}`}
              />
            ) : null}
            {footerActions}
          </View>
        ) : null}
      </View>
    </View>
  );
}
