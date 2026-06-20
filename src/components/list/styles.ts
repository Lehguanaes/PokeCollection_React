import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 20,
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
    width: 280,
    maxWidth: '100%',
  },

  fullWidthSection: {
    alignSelf: 'stretch',
    marginHorizontal: -12,
  },
});
