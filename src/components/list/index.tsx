/*
 * Fornece a lista responsiva reutilizada para coleções de Pokémon.
 * É importada pelas telas de Pokédex, catálogo e time.
 * Alterna entre grade, carrossel e linhas sem rolagem própria.
 */
import React from 'react';
import {
  FlatList,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';

import { styles } from './styles';

/**
 * Configuração da lista genérica usada para grades e carrosséis. Os itens são
 * deliberadamente genéricos porque diferentes telas fornecem formatos de dados
 * e conteúdos visuais distintos.
 */
type ListProps = {
  // Coleção que será dividida em células.
  data: any[];
  // Função opcional que converte cada dado no conteúdo visual de uma célula.
  renderItemContent?: (item: any) => React.ReactNode;
  // Callback de paginação disparado quando a lista se aproxima do final.
  onLoadMore?: () => void;
  // Número explícito de colunas; se ausente, a largura da janela decide.
  columns?: number;
  // Troca a grade vertical por uma sequência horizontal de uma única linha.
  horizontal?: boolean;
  // Define quantos cards devem caber na largura visível do modo horizontal.
  cardPerView?: number;
  // Quando falso, renderiza uma grade comum para participar do scroll da tela pai.
  scrollEnabled?: boolean;
  // Permite complementar o espaçamento do contêiner conforme a tela consumidora.
  contentContainerStyle?: any;
  // Conteúdo opcional exibido antes dos itens, ocupando a largura disponível.
  ListHeaderComponent?: React.ReactElement | null;
  // Conteúdo opcional exibido depois dos itens, também em largura total.
  ListFooterComponent?: React.ReactElement | null;
};

/** Lista responsiva que alterna entre grade, carrossel e conteúdo sem scroll próprio. */
export function List({
  data,
  renderItemContent,
  onLoadMore,
  columns,
  horizontal = false,
  cardPerView,
  scrollEnabled = true,
  contentContainerStyle,
  ListHeaderComponent,
  ListFooterComponent,
}: ListProps) {
  // useWindowDimensions atualiza os cálculos ao girar o aparelho ou redimensionar a web.
  const { width } = useWindowDimensions();

  // Carrosséis sempre usam uma linha. Grades respeitam uma quantidade explícita
  // ou adotam pontos de quebra de uma, duas e três colunas.
  const numColumns = horizontal
    ? 1
    : columns !== undefined
    ? columns
    : width >= 1100
    ? 3
    : width >= 760
    ? 2
    : 1;

  // O carrossel divide a viewport pela quantidade desejada. A grade calcula uma
  // largura entre 260 e 320, descontando padding e espaços entre colunas.
  const itemWidth = cardPerView ? width / cardPerView - 20 : undefined;
  const gridGap = 16;
  const gridPadding = 24;
  const gridItemWidth =
    !horizontal && !cardPerView
      ? Math.min(
          320,
          Math.max(
            260,
            (width - gridPadding - gridGap * Math.max(numColumns - 1, 0)) /
              numColumns -
              8
          )
        )
      : undefined;

  // Sem scroll próprio, FlatList não traz benefício de virtualização. A divisão
  // manual em linhas permite que um contêiner pai controle toda a rolagem.
  if (!scrollEnabled && !horizontal) {
    const rows: any[][] = [];
    // Cada fatia contém no máximo o número responsivo de colunas calculado acima.
    for (let i = 0; i < data.length; i += numColumns) {
      rows.push(data.slice(i, i + numColumns));
    }

    return (
      <View style={[styles.container, contentContainerStyle]}>
        {/* Chaves usam identificadores comuns dos modelos e recorrem ao índice
            apenas quando o item não fornece nenhum identificador conhecido. */}
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, colIndex) => (
              <View
                key={item?.id ?? item?.index ?? item?.nome ?? colIndex}
                style={[
                  styles.itemContainer,
                  gridItemWidth ? { width: gridItemWidth } : null,
                ]}
              >
                {renderItemContent?.(item)}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  // Com rolagem habilitada, FlatList fornece paginação, reciclagem e cabeçalho/
  // rodapé sem que cada tela precise repetir essa configuração.
  return (
    <FlatList
      data={data}
      horizontal={horizontal}
      nestedScrollEnabled
      scrollEnabled={scrollEnabled}
      numColumns={numColumns}
      key={horizontal ? 'horizontal' : `grid-${numColumns}`}
      keyExtractor={(item, index) =>
        String(item?.id ?? item?.index ?? item?.nome ?? index)
      }
      renderItem={({ item }) => (
        // A largura específica só é aplicada quando o modo correspondente a calculou.
        <View
          style={[
            styles.itemContainer,
            horizontal && itemWidth ? { width: itemWidth } : null,
            gridItemWidth ? { width: gridItemWidth } : null,
          ]}
        >
          {renderItemContent?.(item)}
        </View>
      )}
      columnWrapperStyle={
        !horizontal && numColumns > 1 ? styles.row : undefined
      }
      contentContainerStyle={[styles.container, contentContainerStyle]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={false}
      // Android recebe lotes e janela menores para reduzir o custo inicial de
      // renderização; as demais plataformas priorizam preencher a tela mais cedo.
      initialNumToRender={Platform.OS === 'android' ? 4 : 8}
      maxToRenderPerBatch={Platform.OS === 'android' ? 4 : 8}
      updateCellsBatchingPeriod={Platform.OS === 'android' ? 60 : 30}
      windowSize={Platform.OS === 'android' ? 5 : 10}
      ListHeaderComponent={ListHeaderComponent}
      ListHeaderComponentStyle={styles.fullWidthSection}
      ListFooterComponent={ListFooterComponent}
      ListFooterComponentStyle={styles.footerSection}
    />
  );
}
