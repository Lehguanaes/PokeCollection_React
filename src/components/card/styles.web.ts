/*
 * Reúne os estilos da apresentação web do cartão de Pokémon.
 * É importado pela implementação web de Card.
 * Organiza cartões, imagens, metadados, atributos e respostas ao ponteiro.
 */
import {
  StyleSheet,
  Platform,
} from 'react-native';

import { Colors } from '@/constants/colors';

export const styles =
  StyleSheet.create({
    // Estruturas principais dos cartões regular e compacto; ambas compartilham a mesma linguagem visual.
    card: {
      width: 260,
      maxWidth: '100%',
      backgroundColor:
        Colors.white,
      borderRadius: 28,
      borderWidth: 2,
      borderColor:
        Colors.alpha.transparentWhite,
      padding: 18,
      alignItems: 'center',
      gap: 14,
      margin: 10,
      overflow: 'hidden',

      // A web usa transição, cursor e box-shadow CSS; nativo precisa das APIs de sombra e elevation.
      ...(Platform.OS ===
      'web'
        ? {
            transition:
              'all 0.28s cubic-bezier(0.2, 0.9, 0.2, 1)',
            cursor: 'pointer',
            boxShadow:
              `0px 12px 28px ${Colors.alpha.black10}`,
          }
        : {
            shadowColor:
              Colors.text,
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.14,
            shadowRadius: 16,
            elevation: 10,
          }),
    },

    compactCard: {
      width: 230,
      maxWidth: '100%',
      minHeight: 300,
      backgroundColor:
        Colors.white,
      borderRadius: 28,
      borderWidth: 2,
      borderColor:
        Colors.alpha.transparentWhite,
      padding: 18,
      marginRight: 18,
      alignItems: 'center',
      overflow: 'hidden',

      // Repete a resolução por plataforma para conservar o mesmo feedback na variante compacta.
      ...(Platform.OS ===
      'web'
        ? {
            transition:
              'all 0.28s cubic-bezier(0.2, 0.9, 0.2, 1)',
            cursor: 'pointer',
            boxShadow:
              `0px 12px 28px ${Colors.alpha.black10}`,
          }
        : {
            shadowColor:
              Colors.text,
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.14,
            shadowRadius: 16,
            elevation: 10,
          }),
    },

    innerCard: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    // Cabeçalho e identificação resumida: nome centralizado e cápsula opcional de HP.
    topBar: {
      width: '100%',
      alignItems: 'center',
      gap: 5,
    },

    pokeName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.subtitle,
      textTransform:
        'capitalize',
      textAlign: 'center',
      letterSpacing: 0.3,
    },

    hpRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor:
        Colors.alpha.black04,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },

    hpLabel: {
      color: Colors.subtitle,
      fontWeight: '700',
      fontSize: 12,
    },

    hpValue: {
      fontSize: 15,
      fontWeight: 'bold',
    },

    // Molduras e imagens existem em tamanhos regular e compacto, sem mudar a proporção do conteúdo.
    imageWrapper: {
      width: 155,
      height: 155,
      borderRadius: 999,
      borderWidth: 3,
      backgroundColor:
        Colors.imageBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 14,

      // A transição CSS suaviza alterações dinâmicas de borda e sombra causadas pelo hover.
      ...(Platform.OS ===
      'web'
        ? {
            transition:
              'all 0.25s ease',
          }
        : {}),
    },

    compactImageWrapper: {
      width: 135,
      height: 135,
      borderRadius: 999,
      borderWidth: 3,
      backgroundColor:
        Colors.imageBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 14,

      // A versão compacta recebe a mesma transição, mantendo a implementação nativa sem CSS.
      ...(Platform.OS ===
      'web'
        ? {
            transition:
              'all 0.25s ease',
          }
        : {}),
    },

    pokemonImage: {
      width: 115,
      height: 115,
    },

    compactImage: {
      width: 100,
      height: 100,
    },

    // Metadados inferiores agrupam badges de tipo e o número da Pokédex com quebra responsiva.
    footerRow: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 10,
      gap: 10,
    },

    typesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
    },

    indexNumber: {
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.subtitle,
      opacity: 0.7,
    },

    // Atributos são dispostos como rótulo, trilho proporcional e valor numérico alinhado.
    statsSection: {
      width: '100%',
      marginTop: 8,
      gap: 8,
    },

    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    statName: {
      width: 42,
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.subtitle,
    },

    statBarBg: {
      flex: 1,
      height: 10,
      backgroundColor:
        Colors.neutral.softGray,
      borderRadius: 999,
      overflow: 'hidden',
    },

    statBarFill: {
      height: '100%',
      borderRadius: 999,
    },

    statValue: {
      width: 28,
      textAlign: 'right',
      fontSize: 11,
      fontWeight: 'bold',
    },

    // O rodapé distribui a ação principal e quaisquer ações adicionais na largura disponível.
    button: {
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 16,
      backgroundColor: Colors.details,
      borderWidth: 1,
      borderColor: Colors.subtitle,

      ...(Platform.OS === 'web'
        ? {
            transition: 'all 0.25s ease',
            boxShadow: `0px 0px 14px ${Colors.alpha.gold55}`,
          }
        : {}),
    },

    buttonText: {
      color: Colors.label,
      fontSize: 13,
      fontWeight: 'bold',
      letterSpacing: 0.3,
    },

    actionsRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      marginTop: 12,
      width: '100%',
    },
  });
