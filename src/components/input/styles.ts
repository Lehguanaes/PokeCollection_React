/*
 * Centraliza os estilos do campo de entrada e de seu rótulo.
 * É importado pelo componente Input deste módulo.
 * Ajusta cores, espaçamento e o contorno específico da web.
 */
import { StyleSheet, Platform } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  // Cada campo ocupa a largura do formulário e mantém distância do próximo grupo.
  container: {
    marginBottom: 14,
    width: '100%',
  },

  // O rótulo usa peso e contraste suficientes para funcionar como identificação fixa.
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.label,
    marginBottom: 6,
  },

  // O wrapper concentra contorno, arredondamento e fundo para que esses elementos
  // possam receber o estilo animado fornecido pelo consumidor.
  inputWrapper: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.inputBorder,
  },

  // A entrada define o respiro e a tipografia internos. Na web, o contorno padrão
  // do navegador é removido para não se somar à borda desenhada pelo wrapper.
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.placeholder,

    borderWidth: 0,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    }),
  },
});
