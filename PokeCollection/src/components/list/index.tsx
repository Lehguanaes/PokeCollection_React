import React from 'react';

import {
  FlatList,
  useWindowDimensions,
  View,
} from 'react-native';

import { styles } from './styles';

type ListProps = {
  data: any[];

  renderItemContent?: (
    item: any
  ) => React.ReactNode;

  onLoadMore?: () => void;

  columns?: number;

  horizontal?: boolean;

  cardPerView?: number;
};

export function List({
  data,
  renderItemContent,
  onLoadMore,
  columns,
  horizontal = false,
  cardPerView,
}: ListProps) {
  const { width } =
    useWindowDimensions();

  // GRID MODE (POKEDEX)
  const numColumns =
    columns
      ? columns
      : width > 1100
      ? 3
      : width > 700
      ? 2
      : 1;

  // CARD WIDTH (HORIZONTAL MODE - TEAM)
  const itemWidth = cardPerView
    ? width / cardPerView - 20
    : undefined;

  return (
    <FlatList
      data={data}
      horizontal={horizontal}
      numColumns={
        horizontal ? 1 : numColumns
      }
      key={
        horizontal
          ? 'h'
          : numColumns
      }
      keyExtractor={(item) =>
        String(
          item.id ??
            item.index ??
            item.nome
        )
      }
      renderItem={({ item }) => (
        <View
          style={[
            styles.itemContainer,
            horizontal && itemWidth
              ? {
                  width: itemWidth,
                }
              : null,
          ]}
        >
          {renderItemContent?.(
            item
          )}
        </View>
      )}
      columnWrapperStyle={
        !horizontal &&
        numColumns > 1
          ? styles.row
          : undefined
      }
      contentContainerStyle={
        styles.container
      }
      showsHorizontalScrollIndicator={
        false
      }
      showsVerticalScrollIndicator={
        false
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
}