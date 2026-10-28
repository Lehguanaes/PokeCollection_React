/*
 * Define a disposição visual das células e seções da lista.
 * É importado pelo componente List deste módulo.
 * Centraliza grades e libera cabeçalhos e rodapés em largura total.
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // O contêiner cresce com a lista, centraliza as células e oferece respiro nas bordas.
  container: {
    flexGrow: 1,
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  // Cada linha distribui suas colunas no centro com espaçamento uniforme.
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
    marginBottom: 16,
  },

  // A célula oferece uma largura padrão segura, substituída pelos cálculos
  // responsivos quando a lista conhece o espaço disponível.
  itemContainer: {
    alignItems: 'center',
    margin: 4,
    width: 280,
    maxWidth: '100%',
  },

  // Cabeçalho e rodapé anulam o padding horizontal do contêiner para que seções
  // estruturais possam alcançar toda a largura da lista.
  fullWidthSection: {
    alignSelf: 'stretch',
    marginHorizontal: -12,
  },

  footerSection: {
    alignSelf: 'stretch',
    marginHorizontal: -12,
    marginTop: 'auto',
  },
});
