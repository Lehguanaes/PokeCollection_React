import React from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import { styles } from './styles';
import { Card } from '@/components/card';

export function List({ data, onLoadMore }: any) {
  const { width } = useWindowDimensions();

  const numColumns = width > 600 ? 2 : 1;

  return (
    <FlatList
      key={numColumns}
      data={data}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card
          title={item.title}
          description={item.description}
          image={item.image}
        />
      )}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}