/*
 * Reúne os estilos responsivos do menu e de seu acionador.
 * É importado pelo componente Menu deste módulo.
 * Posiciona o painel, os itens e as animações em web e mobile.
 */
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  // No desktop, o menu flutua no canto da tela. No mobile, ele participa do
  // cabeçalho e recebe elevação maior para superar as demais camadas nativas.
  wrapper: {
    position: 'absolute',
    top: 120,
    right: 32,
    zIndex: 999,
    alignItems: 'center',
  },

  mobileWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 5000,
    elevation: 20,
  },

  // Os contêineres posicionam o painel abaixo da Pokébola. A versão móvel ocupa
  // quase toda a largura; a ampla usa largura fixa e alinhamento à direita.
  mobileDropdownContainer: {
    position: 'absolute',
    top: 62,
    left: 16,
    right: 16,
    zIndex: 5001,
    elevation: 21,
  },

  dropdownContainer: {
    position: 'absolute',
    top: 72,
    right: -10,
    width: 260,
    zIndex: 1,
  },

  // Camada sem aparência própria, preservada como ponto de composição do dropdown.
  dropdownGlow: {},

  // Painel amplo: superfície arredondada, borda temática e sombra para separar o
  // menu do conteúdo que continua visível atrás dele.
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: 34,
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 3,
    borderColor: Colors.details,
    shadowColor: Colors.details,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 15,
    overflow: 'hidden',
  },

  // A versão móvel reduz espaçamentos e raios para acomodar todas as opções na
  // altura limitada, mantendo a mesma hierarquia visual e uma elevação superior.
  mobileDropdown: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    gap: 6,
    borderWidth: 3,
    borderColor: Colors.details,
    shadowColor: Colors.details,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 15,
    overflow: 'hidden',
    zIndex: 5002,
  },

  // Itens são linhas com contorno neutro. A variante móvel preserva a área de
  // toque, mas compacta padding e arredondamento para o painel menor.
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
  },

  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
  },

  // A rota atual recebe preenchimento primário, invertendo o contraste do item.
  activeItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Os invólucros dão forma e sombra uniformes aos diferentes desenhos de ícone;
  // no mobile, todas as medidas são reduzidas proporcionalmente.
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.pokeballRed,
    marginRight: 14,
    shadowColor: Colors.pokeballRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  mobileIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.pokeballRed,
    marginRight: 10,
    shadowColor: Colors.pokeballRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },

  // Sobre o item ativo, o fundo branco preserva o contraste do ícone primário.
  activeIcon: {
    backgroundColor: Colors.white,
  },

  // O contêiner flexível deixa o texto ocupar o espaço restante ao lado do ícone.
  textContainer: {
    flex: 1,
  },

  // Tipografia forte facilita a leitura das ações; o tamanho móvel evita quebra
  // desnecessária sem retirar o destaque dos rótulos.
  menuText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.txtPrimary,
  },

  mobileMenuText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.txtPrimary,
  },

  // No item selecionado, o texto branco acompanha o fundo primário.
  activeText: {
    color: Colors.white,
  },

  // Invólucros centralizam a Pokébola e delimitam a área animada de brilho. Os
  // níveis de empilhamento móveis mantêm o botão acima do painel e do cabeçalho.
  glowWrapper: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  mobileGlowWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5003,
    elevation: 23,
  },

  // Discos translúcidos maiores que a bola formam o halo; a escala do wrapper
  // anima todo o conjunto sem exigir propriedades de sombra animáveis.
  glow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: Colors.alpha.primary28,
  },

  mobileGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: Colors.alpha.primary28,
  },

  // Áreas pressionáveis acompanham os dois tamanhos visuais da Pokébola.
  pokeball: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mobilePokeball: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // As camadas internas recebem rotação e escala e concentram a sombra. A versão
  // móvel reduz dimensões e sombra para manter proporção com o cabeçalho compacto.
  ballInner: {
    width: 70,
    height: 70,
    borderRadius: 999,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 14,
  },

  mobileBallInner: {
    width: 52,
    height: 52,
    borderRadius: 999,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 12,
  },

});
