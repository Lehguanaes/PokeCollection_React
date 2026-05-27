import React from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
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
  scrollEnabled?: boolean;
  contentContainerStyle?: any;
};

export function List({
  data,
  renderItemContent,
  onLoadMore,
  columns,
  horizontal = false,
  cardPerView,
  scrollEnabled = true,
  contentContainerStyle,
}: ListProps) {
  const { width } =
    useWindowDimensions();

  // GRID RESPONSIVO
  const numColumns =
    columns
      ? columns
      : width > 1100
      ? 3
      : width > 700
      ? 2
      : 1;

  // WIDTH DOS CARDS HORIZONTAIS
  const itemWidth = cardPerView
    ? width / cardPerView - 20
    : undefined;

  return (
    <FlatList
      data={data}
      horizontal={horizontal}
      nestedScrollEnabled
      scrollEnabled={scrollEnabled}
      numColumns={
        horizontal ? 1 : numColumns
      }
      key={
        horizontal
          ? 'horizontal'
          : `grid-${numColumns}`
      }
      keyExtractor={(
        item,
        index
      ) =>
        String(
          item?.id ??
            item?.index ??
            item?.nome ??
            index
        )
      }
      renderItem={({ item }) => (
        <View
          style={[
            styles.itemContainer,

            horizontal &&
            itemWidth
              ? {
                  width:
                    itemWidth,
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
      contentContainerStyle={[
        styles.container,
        contentContainerStyle,
      ]}
      showsHorizontalScrollIndicator={
        false
      }
      showsVerticalScrollIndicator={
        false
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={
        false
      }
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={10}
    />
  );
}