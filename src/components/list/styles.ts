import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
    marginBottom: 16,
  },

  itemContainer: {
    alignItems: 'center',
    margin: 4,
    width: 280,   // ✅ largura fixa do card — ajuste conforme o tamanho do seu Card
  },
});