/*
 * Centraliza os estilos visuais do botão reutilizável.
 * É importado pelo componente Button em sua entrada pública.
 * Define dimensões, variantes e feedback para hover, pressão e bloqueio.
 */
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  // Base estrutural comum a todas as variantes: centraliza o conteúdo e reserva
  // a borda cuja cor será definida pela intenção do botão.
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  fullWidth: {
    width: '100%',
  },
  // Tamanhos agrupam altura, respiro interno e arredondamento para que toda a
  // área de toque acompanhe a escala visual escolhida.
  medium: {
    minHeight: 52,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 30,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  // Variantes usam cor de fundo e borda para diferenciar ação principal,
  // alternativa e potencialmente destrutiva sem mudar a estrutura do botão.
  primary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.white,
    borderColor: Colors.title,
  },
  // Conteúdo e tipografia mantêm ícone, indicador e título alinhados.
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  smallText: {
    fontSize: 13,
  },
  // Cada cor de texto preserva contraste com o fundo da variante correspondente.
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.label,
  },
  dangerText: {
    color: Colors.title,
  },
  // Estados interativos oferecem feedback progressivo; desabilitado permanece
  // visualmente mais fraco e não recebe os efeitos de hover ou pressão.
  hovered: {
    opacity: 0.88,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
