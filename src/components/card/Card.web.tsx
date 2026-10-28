/*
 * Implementa o cartão visual de Pokémon para a web.
 * É selecionado pela fachada Card nas telas que exibem Pokémon.
 * Adapta o modelo de domínio e preserva a apresentação rica com animações.
 */
import {
  View,
  Text,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { styles } from './styles.web';
import { CardProps } from './types';
import { Button } from '@/components/button';

import {
  STAT_ABBR,
  TYPE_ICONS,
  TYPE_COLORS,
  TYPE_MAP,
} from '@/constants/pokemon';

import {
  Colors,
  getColor,
  withAlpha,
} from '@/constants/colors';

export function Card({
  pokemon,
  onPressDetails,
  footerActions,
}: CardProps) {
  // Adapta o modelo recebido da API para os nomes portugueses usados pela camada visual.
  const { imagem, index, nome: title, poderes, tipos: apiTypes } = pokemon;
  const image = { uri: imagem };
  const tipos = apiTypes.map((type) => TYPE_MAP[type] ?? type);
  const showStats = false;
  const compact = false;
  const animated = Platform.OS !== 'android';
  // A existência do callback também define a variante visual voltada à navegação.
  const showDetailsButton = Boolean(onPressDetails);
  // O estado de hover só tem efeito na web, onde ponteiro, brilho e elevação respondem ao cursor.
  const [hovered, setHovered] =
    useState(false);

  // Valores persistentes de animação evitam recriar controladores a cada renderização.
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

  // A primeira tipagem determina a identidade cromática; getColor garante a paleta normal como reserva.
  const colors =
    getColor(tipos);

  // HP é destacado no cabeçalho e assume zero quando o atributo não veio da API.
  const hpStat = poderes.find(
    (p) => p.nome === 'hp'
  );

  const hp =
    hpStat?.forca ?? 0;

  // Mantém, quando habilitado, dois ciclos independentes: flutuação da imagem e pulsação do brilho.
  // O brilho não usa o driver nativo porque anima uma propriedade visual não suportada por ele.
  useEffect(() => {
    if (!animated) return;

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
  }, [animated]);

  // A entrada do ponteiro eleva e amplia o cartão em paralelo para uma resposta única e imediata.
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

  // A saída restaura os valores-base sem interferir na pulsação contínua do brilho.
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

  // TYPE_COLORS representa a cor de badge do domínio; as reservas mantêm contraste para tipos desconhecidos.
  const accentColor =
    TYPE_COLORS[tipos[0]] ??
    colors.accent ??
    Colors.details;

  // boxShadow é uma capacidade CSS exclusiva da web e complementa as sombras portáveis do React Native.
  const hoverCardStyle =
    Platform.OS === 'web' &&
    hovered
      ? ({
          borderColor:
            accentColor,
          boxShadow: `0 0 0 3px ${withAlpha(accentColor, 0.27)}, 0 0 26px ${withAlpha(accentColor, 0.53)}, 0 18px 34px ${Colors.alpha.black16}, inset 0 0 18px ${withAlpha(accentColor, 0.09)}`,
        } as any)
      : {};

  // O halo da imagem é separado do cartão para reforçar o foco no Pokémon durante o hover.
  const hoverImageStyle =
    Platform.OS === 'web' &&
    hovered
      ? ({
          boxShadow: `0 0 0 5px ${withAlpha(accentColor, 0.13)}, 0 0 34px ${withAlpha(accentColor, 0.67)}`,
        } as any)
      : {};

  return (
    // O Pressable externo captura hover apenas na web; dispositivos nativos não recebem handlers sem sentido.
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
                : Colors.alpha.transparentWhite,

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
          {/* Cabeçalho: apresenta a identidade e, na variante sem ação de detalhes, o HP resumido. */}
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

          {/* Imagem: combina a paleta do tipo com o halo e aplica a flutuação somente quando habilitada. */}
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
                  transform: animated
                    ? [
                        {
                          translateY:
                            floatAnim,
                        },
                      ]
                    : [],
                },
              ]}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Tipos: cada badge herda a cor e o ícone do mapeamento de domínio e reage ao hover na web. */}
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
                        : Colors.transparent,

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
                      // O estado render-prop mantém texto e fundo sincronizados no mesmo frame de hover.
                      const hovered = Boolean(state.hovered);

                      return (
                        <Text
                          style={{
                          color:
                            Platform.OS ===
                              'web' &&
                            hovered
                              ? Colors.white
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

          {/* Atributos: abrevia nomes conhecidos e normaliza barras contra 150, limitando-as a 100%. */}
          {showStats && (
            <View
              style={
                styles.statsSection
              }
            >
              {poderes.map(
                (
                   poder
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

          {/* Ações: reúne a navegação padrão e extensões do consumidor em um único rodapé opcional. */}
          {showDetailsButton || footerActions ? (
            <View style={styles.actionsRow}>
              {showDetailsButton ? (
                <Button
                  title="Ver detalhes"
                  variant="secondary"
                  size="small"
                  fullWidth={false}
                  style={styles.button}
                  textStyle={styles.buttonText}
                  onPress={onPressDetails ? () => onPressDetails(pokemon) : undefined}
                  accessibilityLabel={`Ver detalhes de ${title}`}
                />
              ) : null}
              {footerActions}
            </View>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}
