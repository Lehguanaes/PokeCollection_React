/*
 * Define os estilos responsivos do modal de detalhes do Pokémon.
 * É importado pelo DetailsModal deste módulo.
 * Organiza painel, identidade, atributos e ações em várias plataformas.
 */
import { Platform, StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  // Camada modal: centraliza o painel, escurece o restante da interface e oferece margem segura.
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.alpha.slate72,
    padding: 16,
  },
  backdropDismiss: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  // Superfície principal: limita largura/overflow e combina borda temática com sombra multiplataforma.
  modal: {
    width: '100%',
    maxWidth: 680,
    overflow: 'hidden',
    backgroundColor: Colors.neutral.white,
    borderRadius: 28,
    borderTopWidth: 6,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 30,
    elevation: 20,
  },
  modalMobile: {
    borderRadius: 22,
  },
  // Área rolável: mantém espaçamento interno suficiente para o botão de fechar sobreposto.
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    padding: 28,
    paddingTop: 34,
  },
  // Controle de fechamento: fica acima da rolagem e oferece alvo circular de toque.
  closeButton: {
    position: 'absolute',
    zIndex: 2,
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: Colors.semantic.muted.background,
  },
  closeButtonText: {
    color: Colors.semantic.muted.strongText,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '500',
  },
  // Hero responsivo: lado a lado em telas amplas e empilhado em larguras móveis.
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  heroMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  // Retrato temático: halo circular dimensiona a imagem sem distorcer sua proporção.
  imageHalo: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 110,
    borderWidth: 2,
  },
  image: {
    width: '88%',
    height: '88%',
  },
  // Bloco de identidade: reúne índice, nome e metadados com hierarquia tipográfica clara.
  identity: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  index: {
    marginBottom: 3,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  name: {
    color: Colors.semantic.muted.heading,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  // Tipos: badges podem quebrar linha e usam cor dinâmica aplicada pelo componente.
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  typeBadge: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Medidas: altura e peso ocupam cartões equivalentes e distinguem rótulo de valor.
  measurements: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  measurementCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.semantic.muted.surface,
    borderWidth: 1,
    borderColor: Colors.semantic.muted.border,
  },
  measurementLabel: {
    color: Colors.semantic.muted.text,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  measurementValue: {
    marginTop: 3,
    color: Colors.slate[800],
    fontSize: 17,
    fontWeight: '900',
  },
  // Seções informativas: padronizam título e separação vertical entre grupos do domínio.
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    marginBottom: 12,
    color: Colors.semantic.muted.strongText,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  // Habilidades e estado vazio: badges quebram linha, enquanto ausência recebe tratamento discreto.
  abilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  abilityBadge: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.semantic.muted.background,
  },
  abilityText: {
    color: Colors.semantic.muted.strongText,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    color: Colors.semantic.muted.subtleText,
    fontSize: 14,
    fontStyle: 'italic',
  },
  // Atributos: cada linha alinha rótulo fixo, trilho flexível e valor com dígitos tabulares.
  stats: {
    gap: 11,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    width: 92,
    color: Colors.semantic.muted.text,
    fontSize: 12,
    fontWeight: '700',
  },
  statTrack: {
    flex: 1,
    height: 9,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: Colors.semantic.muted.border,
  },
  statFill: {
    height: '100%',
    borderRadius: 999,
  },
  statValue: {
    width: 30,
    color: Colors.slate[800],
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  // Rodapé de ações: separa decisões do conteúdo e permite quebra em janelas estreitas.
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.semantic.muted.border,
  },
  actionButton: {
    minWidth: 116,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  // Feedback compartilhado pelos controles pressionáveis do modal.
  pressed: {
    opacity: 0.72,
  },
});
