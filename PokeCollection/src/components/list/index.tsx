import React from 'react';
import { FlatList, useWindowDimensions } from 'react-native';

import { styles } from './styles';
import { Card } from '@/components/card';

type ListProps = {
  data: any[];
  onLoadMore?: () => void;
  renderItemContent?: (item: any) => React.ReactNode;
};

export function List({
  data,
  onLoadMore,
  renderItemContent,
}: ListProps) {
  const { width } = useWindowDimensions();

  const numColumns = width > 600 ? 2 : 1;

  return (
    <FlatList
      key={numColumns}
      data={data}
      numColumns={numColumns}
      keyExtractor={(item) => `${item.index}-${item.nome}`}
      renderItem={({ item }) => (
        <>
          <Card
            title={item.nome}
            description={`#${item.index}`}
            image={{ uri: item.imagem }}
          />
          {renderItemContent?.(item)}
        </>
      )}
      columnWrapperStyle={
        numColumns > 1 ? styles.row : undefined
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
}