import React from 'react';
import {
  FlatList,
  useWindowDimensions,
  View,
} from 'react-native';

import { styles } from './styles';

type ListProps = {
  data: any[];
  renderItemContent?: (item: any) => React.ReactNode;
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
  const { width } = useWindowDimensions();

  const numColumns = horizontal
    ? 1
    : columns !== undefined
    ? columns
    : width >= 1100
    ? 3
    : width >= 560
    ? 2
    : 1;

  const itemWidth = cardPerView ? width / cardPerView - 20 : undefined;

  if (!scrollEnabled && !horizontal) {
    const rows: any[][] = [];
    for (let i = 0; i < data.length; i += numColumns) {
      rows.push(data.slice(i, i + numColumns));
    }

    return (
      <View style={[styles.container, contentContainerStyle]}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, colIndex) => (
              <View
                key={item?.id ?? item?.index ?? item?.nome ?? colIndex}
                style={styles.itemContainer}
              >
                {renderItemContent?.(item)}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

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
        <View
          style={[
            styles.itemContainer,
            horizontal && itemWidth ? { width: itemWidth } : null,
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
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={10}
    />
  );
}