/*
 * Fornece a estrutura comum das telas autenticadas do aplicativo.
 * É importado pelas rotas de câmera, mapa, Pokédex, Pokémon, perfil e equipe.
 * Combina fundo, navegação responsiva e o conteúdo específico de cada tela.
 */
import { PropsWithChildren } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Background } from '@/components/background';
import { Menu } from '@/components/menu';
import { Colors } from '@/constants/colors';

// Abaixo desta largura, a navegação deixa de flutuar sobre a tela e passa a
// ser responsabilidade do Header. Manter o mesmo limite nos dois componentes
// evita que o menu apareça duas vezes ou desapareça durante o redimensionamento.
const MOBILE_BREAKPOINT = 560;

/**
 * Estrutura externa compartilhada pelas telas autenticadas.
 * `children` representa o conteúdo específico de cada rota; o componente se
 * limita a fornecer o fundo e a navegação apropriada para o tamanho da janela.
 */
export function Screen({ children }: PropsWithChildren) {
  // O hook reage também a mudanças de orientação e ao redimensionamento da web,
  // portanto a decisão responsiva não fica presa ao tamanho inicial da tela.
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {/* O fundo vem primeiro para permanecer atrás de todo o conteúdo. */}
      <Background />
      {/* Em telas amplas, o menu é independente do Header e fica sobre a página. */}
      {width >= MOBILE_BREAKPOINT ? <Menu /> : null}
      {/* Cada rota ocupa o restante da estrutura sem acoplamento com este componente. */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // A raiz preenche a área disponível e oferece uma cor de base enquanto o
  // fundo decorativo carrega ou quando ele é omitido em plataformas menores.
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
