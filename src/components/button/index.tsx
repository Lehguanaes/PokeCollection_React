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
      style={(state: any) => {
        const hovered = Boolean(state.hovered);

        return [
          styles.button,
          hovered && styles.hover,
          state.pressed && styles.pressed,
        ];
      }}
    >
      {(state: any) => {
        const hovered = Boolean(state.hovered);

        return (
          <Text style={[styles.text, hovered && styles.textHover]}>
            {title}
          </Text>
        );
      }}
    </Pressable>
  );
}
