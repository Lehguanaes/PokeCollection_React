/*
 * Concentra os estilos da apresentação nativa do Card.
 * É importado pela implementação Android compartilhada com o iOS.
 * Organiza retrato, metadados, atributos e ações para toque.
 */
import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  // Contêiner nativo horizontal: concentra a informação essencial em uma área confortável para toque.
  nativeCard: {
    width: 320,
    maxWidth: '100%',
    minHeight: 148,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 2,
    padding: 12,
    gap: 12,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },

  // Retrato: reserva uma coluna fixa e cria um anel temático ao redor da imagem.
  nativeImageShell: {
    width: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nativeImageRing: {
    width: 88,
    height: 88,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nativeImage: {
    width: 70,
    height: 70,
  },

  // Conteúdo principal: usa flexibilidade e minWidth zero para permitir truncamento correto do título.
  nativeContent: {
    flex: 1,
    minWidth: 0,
    gap: 7,
  },

  // Identidade: distribui nome flexível e índice compacto nas extremidades da linha.
  nativeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  nativeTitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  nativeIndex: {
    fontSize: 12,
    fontWeight: '900',
  },

  // Metadados: cápsulas de HP e tipos compartilham a linha e acomodam quebra quando necessário.
  nativeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  nativeHpPill: {
    minWidth: 52,
    height: 28,
    borderRadius: 999,
    backgroundColor: Colors.alpha.black04,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },

  nativeHpLabel: {
    color: Colors.gray[800],
    fontSize: 11,
    fontWeight: '800',
  },

  nativeHpValue: {
    fontSize: 13,
    fontWeight: '900',
  },

  nativeTypesRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  nativeTypePill: {
    minHeight: 28,
    maxWidth: 88,
    borderRadius: 999,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  nativeTypeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'capitalize',
  },

  // Resumo de atributos: três células equivalentes destacam abreviação e valor sem usar barras.
  nativeStatsRow: {
    flexDirection: 'row',
    gap: 6,
  },

  nativeStatPill: {
    flex: 1,
    minHeight: 30,
    borderRadius: 10,
    backgroundColor: Colors.alpha.primary12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nativeStatName: {
    color: Colors.gray[500],
    fontSize: 9,
    fontWeight: '900',
  },

  nativeStatValue: {
    fontSize: 12,
    fontWeight: '900',
  },

  // Rodapé de ações: o botão de detalhes cresce, enquanto ações adicionais mantêm seu tamanho próprio.
  nativeDetailsButton: {
    alignSelf: 'flex-start',
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
  },

  nativeDetailsText: {
    fontSize: 12,
    fontWeight: '900',
  },

  nativeActionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    width: '100%',
  },
});
