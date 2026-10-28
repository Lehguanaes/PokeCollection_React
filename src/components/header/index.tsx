/*
 * Define o cabeçalho temático compartilhado da aplicação.
 * Aparece nas telas autenticadas e na entrada de autenticação.
 * Adapta a Pokébola, o menu e a área segura ao tamanho da tela.
 */
import { Platform, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { Menu } from "@/components/menu";

/** Configura se o menu interativo deve aparecer na versão móvel do cabeçalho. */
type HeaderProps = {
  // Quando falso, preserva o desenho do cabeçalho sem oferecer a navegação móvel.
  showMenu?: boolean;
};

/** Cabeçalho inspirado na divisão visual de uma Pokébola. */
export function Header({ showMenu = true }: HeaderProps) {
  // A largura determina a composição móvel, e os insets protegem o conteúdo da
  // barra de status ou recortes físicos informados pela área segura do aparelho.
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 560;
  // No Android móvel, garante-se ao menos 24 pontos no topo mesmo quando o
  // dispositivo não informa um inset maior. Outras plataformas mantêm o layout base.
  const topInset =
    isMobile && Platform.OS === 'android'
      ? Math.max(insets.top, 24)
      : 0;
  // As alturas derivadas deslocam juntas a faixa vermelha, a linha e o contêiner,
  // mantendo a geometria original abaixo da área segura.
  const mobileRedHeight = 44 + topInset;
  const mobileContainerHeight = 78 + topInset;

  return (
    // A altura calculada só entra no modo móvel, pois no desktop os estilos fixos
    // já definem todas as proporções do cabeçalho.
    <View
      style={[
        styles.container,
        isMobile && styles.containerMobile,
        isMobile && { height: mobileContainerHeight },
      ]}
    >
      {/* Metade vermelha superior da Pokébola. */}
      <View
        style={[
          styles.topHalf,
          isMobile && styles.topHalfMobile,
          isMobile && { height: mobileRedHeight },
        ]}
      />
      {/* Linha escura que divide as duas metades e acompanha o inset no Android. */}
      <View
        style={[
          styles.middleLine,
          isMobile && styles.middleLineMobile,
          isMobile && { top: mobileRedHeight },
        ]}
      />

      {/* No móvel, a Pokébola central vira o acionador do Menu; em telas amplas,
          um círculo estático completa o desenho porque o menu já fica na página. */}
      {isMobile && showMenu ? (
        <Menu />
      ) : (
        <View style={styles.circle} />
      )}
    </View>
  );
}
