import React from 'react';
import { FlatList, useWindowDimensions, View,} from 'react-native';
import { styles } from './styles';

type ListProps = {
  data: any[];
  onLoadMore?: () => void;
  renderItemContent?: (
    item: any
  ) => React.ReactNode;
};

export function List({
  data,
  onLoadMore,
  renderItemContent,
}: ListProps) {
  const { width } =
    useWindowDimensions();

  const numColumns =
    width > 600 ? 2 : 1;

  return (
    <FlatList
      data={data}
      numColumns={numColumns}
      key={numColumns}
      keyExtractor={(item) =>
        String(
          item.id ??
            item.index ??
            item.nome
        )
      }
      renderItem={({ item }) => (
        <View
          style={
            styles.itemContainer
          }
        >
          {renderItemContent?.(
            item
          )}
        </View>
      )}
      columnWrapperStyle={
        numColumns > 1
          ? styles.row
          : undefined
      }
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
      onEndReached={
        onLoadMore
      }
      onEndReachedThreshold={
        0.5
      }
    />
  );
}