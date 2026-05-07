import React from "react";
import { Pressable, Text, PressableProps } from "react-native";
import { styles } from "./styles";

type Props = PressableProps & {
  title: string;
};

export function Button({ title, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      style={({ pressed, hovered }) => [
        styles.button,
        hovered && styles.hover,
        pressed && styles.pressed,
      ]}
    >
      {({ hovered }) => (
        <Text style={[styles.text, hovered && styles.textHover]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}