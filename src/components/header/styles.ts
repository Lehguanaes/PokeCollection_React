/*
 * Reúne os estilos visuais do cabeçalho em forma de Pokébola.
 * É importado pelo componente Header deste módulo.
 * Dimensiona faixas, divisor e centro para desktop e celular.
 */
import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

// Medidas-base mantêm alinhadas as camadas que formam a Pokébola. As variantes
// móveis reservam mais espaço para toque e podem ser acrescidas da área segura.
const RED_HEIGHT = 33;
const RED_HEIGHT_MOBILE = 44;
const LINE_HEIGHT = 6;
const LINE_HEIGHT_MOBILE = 5;
const CONTAINER_HEIGHT = 72;
const CONTAINER_HEIGHT_MOBILE = 78;

export const styles = StyleSheet.create({
  // Estrutura principal do cabeçalho amplo, com conteúdo central sobre as
  // camadas absolutas e zIndex alto para permanecer acima da tela.
  container: {
    width: '100%',
    alignSelf: 'stretch',
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 999,
  },
  // No móvel, o conteúdo é apoiado na base para posicionar o botão do menu sobre a linha.
  containerMobile: {
    height: CONTAINER_HEIGHT_MOBILE,
    justifyContent: 'flex-end',  
    paddingBottom: 6,            
  },

  // Faixa vermelha superior e sua altura alternativa para telas móveis.
  topHalf: {
    position: 'absolute',
    top: 0,
    height: RED_HEIGHT,
    width: '100%',
    backgroundColor: Colors.pokeballRed,
  },
  topHalfMobile: {
    height: RED_HEIGHT_MOBILE,
  },

  // Divisor horizontal preto; a variante móvel acompanha a faixa superior maior.
  middleLine: {
    position: 'absolute',
    top: RED_HEIGHT,
    height: LINE_HEIGHT,
    width: '100%',
    backgroundColor: Colors.black,
  },
  middleLineMobile: {
    top: RED_HEIGHT_MOBILE,
    height: LINE_HEIGHT_MOBILE,
  },

  // Centro estático usado no desktop para completar a referência visual à Pokébola.
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    borderWidth: 5,
    borderColor: Colors.black,
  },
});
