import React, { useEffect, useRef } from "react";
import { View, Animated, Image, Text } from "react-native";
import { styles } from "./styles";

export function Footer() {
  const translateX = useRef(new Animated.Value(0)).current;

  const ITEM_W = 64;
  const pokemons = [1,4,7,25,39,52,63,66,94,116,129,131,133,143,147,152,155,158];
  const totalW = ITEM_W * pokemons.length;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -totalW,
        duration: 28000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const all = [...pokemons, ...pokemons];

  return (
    <View style={styles.footer}>

      <View style={styles.carouselContainer}>
        <Animated.View
          style={[
            styles.row,
            { width: totalW * 2, transform: [{ translateX }] }
          ]}
        >
          {all.map((id, index) => (
            <Image
              key={index}
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
              }}
              style={styles.pokemon}
            />
          ))}
        </Animated.View>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.copy}>
          © 2026 - Aprendendo React Native com PokeCollection - Letícia e Erick
        </Text>
      </View>

    </View>
  );
}