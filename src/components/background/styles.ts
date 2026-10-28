/*
 * Reúne os estilos da composição decorativa de fundo.
 * É importado exclusivamente pelo componente Background.
 * Posiciona quatro ilustrações fora do fluxo em diferentes áreas da tela.
 */
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // A camada cobre toda a tela sem participar do fluxo do conteúdo principal.
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

    // As quatro regras abaixo distribuem as ilustrações em lados e alturas
    // alternados. Os tamanhos levemente diferentes evitam uma grade rígida e
    // reforçam que se trata de uma composição decorativa para telas amplas.
    p1: {
        position: 'absolute',
        top: 160,
        left: 60,
        width: 150,
        height: 150,
    },

    p2: {
        position: 'absolute',
        top: 240,
        right: 70,
        width: 180,
        height: 180,
    },

    p3: {
        position: 'absolute',
        top: 470,
        left: 90,
        width: 160,
        height: 160,
    },

    p4: {
        position: 'absolute',
        top: 570,
        right: 140,
        width: 160,
        height: 160,
    },
});
