/*
 * Define a apresentação visual do rodapé compartilhado.
 * É importado exclusivamente pelo componente Footer.
 * Dimensiona o carrossel, suas imagens e a barra inferior de créditos.
 */
import { StyleSheet } from "react-native";
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  // `marginTop: auto` empurra o rodapé para o fim quando a tela tem pouco
  // conteúdo, enquanto a largura total mantém as duas faixas alinhadas à página.
  footer: {
    backgroundColor: Colors.white,
    marginTop: 'auto',
    width: '100%',
  },

  // A janela fixa do carrossel esconde as imagens antes e depois da área útil.
  carouselContainer: {
    height: 75,
    overflow: 'hidden',
  },

  // A sequência precisa permanecer em uma única linha para o deslocamento horizontal.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // As dimensões e margens resultam nos 73 pontos usados no cálculo da animação.
  pokemon: {
    width: 65,
    height: 65,
    marginHorizontal: 4,
    marginTop: 8,
  },

  // A barra escura cria contraste e centraliza o texto em qualquer largura.
  bottomBar: {
    width: '100%',
    backgroundColor: Colors.neutral.black,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // O texto pode quebrar em telas estreitas sem tocar as bordas da barra.
  copy: {
    color: Colors.neutral.white,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '90%', 
  },
});
