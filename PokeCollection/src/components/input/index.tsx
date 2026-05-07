import React from "react";
import { View, Text, TextInput, TextInputProps, Animated, StyleSheet } from "react-native";
import { styles } from "./styles";

type Props = TextInputProps & {
  label: string;
  animatedStyle?: any;
};

export function Input({ label, animatedStyle, ...rest }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View style={[styles.inputWrapper, animatedStyle]}>
        <TextInput style={styles.input as any} {...rest} />
      </Animated.View>
    </View>
  );
}