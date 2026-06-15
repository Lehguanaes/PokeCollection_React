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
  const [hovered, setHovered] =
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
    setHovered(true);

    Animated.parallel([
      Animated.spring(
        hoverScale,
        {
          toValue: 1.055,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        hoverY,
        {
          toValue: -10,
          useNativeDriver: true,
        }
      ),
    ]).start();
  };

  const handleHoverOut = () => {
    setHovered(false);

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

  const accentColor =
    TYPE_COLORS[tipos[0]] ??
    colors.accent ??
    Colors.details;

  const hoverCardStyle =
    Platform.OS === 'web' &&
    hovered
      ? ({
          borderColor:
            accentColor,
          boxShadow: `0 0 0 3px ${accentColor}44, 0 0 26px ${accentColor}88, 0 18px 34px rgba(0,0,0,0.16), inset 0 0 18px ${accentColor}18`,
        } as any)
      : {};

  const hoverImageStyle =
    Platform.OS === 'web' &&
    hovered
      ? ({
          boxShadow: `0 0 0 5px ${accentColor}22, 0 0 34px ${accentColor}AA`,
        } as any)
      : {};

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
              hovered ? 0.42 : glowAnim,

            borderColor:
              hovered
                ? accentColor
                : 'rgba(255,255,255,0)',

            shadowColor:
              accentColor,
          },
          hoverCardStyle,
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
                    ? accentColor
                    : colors.accent,

                shadowColor:
                  accentColor,

                shadowOpacity:
                  hovered ? 0.55 : glowAnim,
              },
              hoverImageStyle,
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
                    style={(state: any) => ({
                      borderColor:
                        showDetailsButton
                          ? TYPE_COLORS[
                              tipo
                            ]
                          : colors.accent,

                      backgroundColor:
                        Platform.OS ===
                          'web' &&
                        Boolean(state.hovered)
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

                      transform: Boolean(state.hovered)
                        ? [
                            {
                              scale: 1.05,
                            },
                          ]
                        : [],
                    })}
                  >
                    {(state: any) => {
                      const hovered = Boolean(state.hovered);

                      return (
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
                      );
                    }}
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
