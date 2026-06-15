import React, { useEffect, useState, useRef } from "react";
import { Image, Platform, useWindowDimensions, Animated } from "react-native";
import { styles } from "./styles";

type PokemonBackgroundItem = {
  uri: string;
  styleKey: "p1" | "p2" | "p3" | "p4";
};

type Props = {
  items?: PokemonBackgroundItem[];
};

const POKEMONS = [
  1, 4, 6, 7, 9, 25, 26, 37, 39,
  52, 59, 65, 68, 94, 95, 130,
  131, 133, 143, 149, 150, 151,
];

const STYLE_KEYS = ["p1", "p2", "p3", "p4"] as const;

function generatePokemons(): PokemonBackgroundItem[] {
  const shuffled = [...POKEMONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).map((pokemonId, index) => ({
    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
    styleKey: STYLE_KEYS[index],
  }));
}

export function Background({ items }: Props) {
  const { width } = useWindowDimensions();
  const isAndroid = Platform.OS === "android";
  const isSmallScreen = width < 768;

  const [randomPokemons, setRandomPokemons] = useState<PokemonBackgroundItem[]>(
    () => generatePokemons()
  );

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // Troca os pokémons
        setRandomPokemons(generatePokemons());

        // Fade in
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isAndroid || isSmallScreen) return null;

  const data = items?.length ? items : randomPokemons;

  return (
    <Animated.View
      style={[styles.container, { opacity }]}
      pointerEvents="none"
    >
      {data.map((item, index) => {
        const imageStyle =
          item.styleKey === "p1" ? styles.p1
          : item.styleKey === "p2" ? styles.p2
          : item.styleKey === "p3" ? styles.p3
          : styles.p4;

        return (
          <Image
            key={`${item.uri}-${index}`}
            source={{ uri: item.uri }}
            style={imageStyle}
          />
        );
      })}
    </Animated.View>
  );
}