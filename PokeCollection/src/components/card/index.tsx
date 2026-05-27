import {
  View,
  Text,
  Animated,
  ImageSourcePropType,
  Pressable,
  Platform,
} from 'react-native';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { styles } from './styles';

import { Alert } from '@/components/alert';

import { Poder } from '@/@types/pokemon';

import {
  TYPE_ICONS,
  TYPE_COLORS,
} from '@/constants/pokemon';

import {
  Colors,
  getColor,
} from '@/constants/colors';

interface CardProps {
  title: string;

  image:
    | ImageSourcePropType
    | {
        uri: string;
      };

  tipos?: string[];

  poderes?: Poder[];

  index?: number;

  showDetailsButton?: boolean;

  showStats?: boolean;

  compact?: boolean;
}

const STAT_ABBR: Record<
  string,
  string
> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.A',
  'special-defense': 'SP.D',
  speed: 'SPD',
};

export function Card({
  title,
  image,
  tipos = [],
  poderes = [],
  index,
  showDetailsButton = false,
  showStats = false,
  compact = false,
}: CardProps) {
  const [visible, setVisible] =
    useState(false);

  const floatAnim = useRef(
    new Animated.Value(0)
  ).current;

  const hoverScale = useRef(
    new Animated.Value(1)
  ).current;

  const hoverY = useRef(
    new Animated.Value(0)
  ).current;

  const glowAnim = useRef(
    new Animated.Value(0.15)
  ).current;

  const colors =
    getColor(tipos);

  const hpStat = poderes.find(
    (p) => p.nome === 'hp'
  );

  const hp =
    hpStat?.forca ?? 0;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          floatAnim,
          {
            toValue: -10,
            duration: 1600,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          floatAnim,
          {
            toValue: 0,
            duration: 1600,
            useNativeDriver: true,
          }
        ),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(
          glowAnim,
          {
            toValue: 0.35,
            duration: 1400,
            useNativeDriver: false,
          }
        ),
        Animated.timing(
          glowAnim,
          {
            toValue: 0.15,
            duration: 1400,
            useNativeDriver: false,
          }
        ),
      ])
    ).start();
  }, []);

  const handleHoverIn = () => {
    Animated.parallel([
      Animated.spring(
        hoverScale,
        {
          toValue: 1.04,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        hoverY,
        {
          toValue: -8,
          useNativeDriver: true,
        }
      ),
    ]).start();
  };

  const handleHoverOut = () => {
    Animated.parallel([
      Animated.spring(
        hoverScale,
        {
          toValue: 1,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        hoverY,
        {
          toValue: 0,
          useNativeDriver: true,
        }
      ),
    ]).start();
  };

  return (
    <Pressable
      onHoverIn={
        Platform.OS === 'web'
          ? handleHoverIn
          : undefined
      }
      onHoverOut={
        Platform.OS === 'web'
          ? handleHoverOut
          : undefined
      }
    >
      <Animated.View
        style={[
          compact
            ? styles.compactCard
            : styles.card,

          {
            transform: [
              {
                scale:
                  hoverScale,
              },
              {
                translateY:
                  hoverY,
              },
            ],

            shadowOpacity:
              glowAnim,

            borderColor:
              colors.accent,
          },
        ]}
      >
        <View
          style={
            styles.innerCard
          }
        >
          {/* HEADER */}
          <View
            style={styles.topBar}
          >
            <Text
              style={
                styles.pokeName
              }
              numberOfLines={1}
            >
              {title}
            </Text>

            {!showDetailsButton && (
              <View
                style={
                  styles.hpRow
                }
              >
                <Text
                  style={
                    styles.hpLabel
                  }
                >
                  HP
                </Text>

                <Text
                  style={[
                    styles.hpValue,
                    {
                      color:
                        colors.accent,
                    },
                  ]}
                >
                  {hp}
                </Text>
              </View>
            )}
          </View>

          {/* IMAGE */}
          <Animated.View
            style={[
              compact
                ? styles.compactImageWrapper
                : styles.imageWrapper,

              {
                borderColor:
                  showDetailsButton
                    ? TYPE_COLORS[
                        tipos[0]
                      ] ??
                      Colors.details
                    : colors.accent,

                shadowColor:
                  colors.accent,

                shadowOpacity:
                  glowAnim,
              },
            ]}
          >
            <Animated.Image
              source={image}
              style={[
                compact
                  ? styles.compactImage
                  : styles.pokemonImage,

                {
                  transform: [
                    {
                      translateY:
                        floatAnim,
                    },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          </Animated.View>

          {/* TYPES */}
          <View
            style={
              styles.footerRow
            }
          >
            <View
              style={
                styles.typesRow
              }
            >
              {tipos.map(
                (tipo) => (
                  <Pressable
                    key={tipo}
                    style={({
                      hovered,
                    }) => ({
                      borderColor:
                        showDetailsButton
                          ? TYPE_COLORS[
                              tipo
                            ]
                          : colors.accent,

                      backgroundColor:
                        Platform.OS ===
                          'web' &&
                        hovered
                          ? showDetailsButton
                            ? TYPE_COLORS[
                                tipo
                              ]
                            : colors.accent
                          : 'transparent',

                      flexDirection:
                        'row',

                      alignItems:
                        'center',

                      gap: 4,

                      paddingVertical: 7,

                      paddingHorizontal: 12,

                      borderRadius: 999,

                      borderWidth: 1.5,

                      transform: hovered
                        ? [
                            {
                              scale: 1.05,
                            },
                          ]
                        : [],
                    })}
                  >
                    {({
                      hovered,
                    }) => (
                      <Text
                        style={{
                          color:
                            Platform.OS ===
                              'web' &&
                            hovered
                              ? '#fff'
                              : showDetailsButton
                              ? TYPE_COLORS[
                                  tipo
                                ]
                              : colors.accent,

                          fontWeight:
                            '700',

                          fontSize: 12,

                          textTransform:
                            'capitalize',
                        }}
                      >
                        {
                          TYPE_ICONS[
                            tipo
                          ]
                        }{' '}
                        {tipo}
                      </Text>
                    )}
                  </Pressable>
                )
              )}
            </View>

            {!showDetailsButton &&
              index && (
                <Text
                  style={
                    styles.indexNumber
                  }
                >
                  #{index}
                </Text>
              )}
          </View>

          {/* STATS */}
          {showStats && (
            <View
              style={
                styles.statsSection
              }
            >
              {poderes.map(
                (
                  poder: Poder
                ) => (
                  <View
                    key={
                      poder.nome
                    }
                    style={
                      styles.statRow
                    }
                  >
                    <Text
                      style={
                        styles.statName
                      }
                    >
                      {STAT_ABBR[
                        poder.nome
                      ] ??
                        poder.nome
                          .slice(
                            0,
                            4
                          )
                          .toUpperCase()}
                    </Text>

                    <View
                      style={
                        styles.statBarBg
                      }
                    >
                      <View
                        style={[
                          styles.statBarFill,
                          {
                            width: `${
                              Math.min(
                                (poder.forca /
                                  150) *
                                  100,
                                100
                              )
                            }%` as any,

                            backgroundColor:
                              colors.accent,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.statValue,
                        {
                          color:
                            colors.accent,
                        },
                      ]}
                    >
                      {
                        poder.forca
                      }
                    </Text>
                  </View>
                )
              )}
            </View>
          )}

          {/* BUTTON */}
          {showDetailsButton && (
            <Pressable
              style={
                styles.button
              }
              onPress={() =>
                setVisible(true)
              }
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                Ver detalhes
              </Text>
            </Pressable>
          )}
        </View>

        {/* ALERT */}
        <Alert
          visible={visible}
          onClose={() =>
            setVisible(false)
          }
          type="info"
          title={`🔎 ${title}`}
          message={`
═══════════════════════

TIPOS

${tipos
  .map(
    (t) =>
      `${TYPE_ICONS[t]} ${t}`
  )
  .join(' | ')}

═══════════════════════

PODERES

${poderes
  .map(
    (p) =>
      `⚡ ${p.nome
        .replace(
          '-',
          ' '
        )
        .toUpperCase()} (${p.forca})`
  )
  .join(' | ')}

═══════════════════════
`}
        />
      </Animated.View>
    </Pressable>
  );
}