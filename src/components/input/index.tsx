/*
 * Implementa o campo de texto reutilizável dos formulários.
 * É usado principalmente nas telas do fluxo de autenticação.
 * Combina rótulo fixo, entrada nativa e contorno animável.
 */
import React from "react";
import { View, Text, TextInput, TextInputProps, Animated } from "react-native";
import { styles } from "./styles";

/**
 * Propriedades do campo com rótulo. Todas as opções nativas de TextInput são
 * aceitas, além de uma animação opcional aplicada ao contorno externo.
 */
type Props = TextInputProps & {
  // Texto que identifica claramente o dado esperado no campo.
  label: string;
  // Estilo animado externo, útil para feedback de foco ou validação sem animar o texto.
  animatedStyle?: any;
};

/** Agrupa rótulo e entrada em uma unidade visual reutilizável de formulário. */
export function Input({ label, animatedStyle, ...rest }: Props) {
  return (
    <View style={styles.container}>
      {/* O rótulo permanece visível mesmo quando há placeholder ou valor digitado. */}
      <Text style={styles.label}>{label}</Text>

      {/* A animação fica no wrapper para incluir fundo e borda; as propriedades
          restantes são encaminhadas ao TextInput sem limitar sua API nativa. */}
      <Animated.View style={[styles.inputWrapper, animatedStyle]}>
        <TextInput style={styles.input as any} {...rest} />
      </Animated.View>
    </View>
  );
}
