import React from "react";
import { View, Image, Platform, useWindowDimensions } from "react-native";
import { styles } from "./styles";

type PokemonBackgroundItem = {
    uri: string;
    styleKey: keyof typeof styles;
};

type Props = {
    items?: PokemonBackgroundItem[];
};

export function BackgroundPokemons({ items }: Props) {
    const { width } = useWindowDimensions();

    // regra: some no Android OU em telas pequenas
    const isAndroid = Platform.OS === "android";
    const isSmallScreen = width < 768;

    if (isAndroid || isSmallScreen) {
        return null;
    }

    const defaultItems: PokemonBackgroundItem[] = [
        {
        uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
        styleKey: "p1",
        },
        {
        uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        styleKey: "p2",
        },
        {
        uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
        styleKey: "p3",
        },
        {
        uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
        styleKey: "p4",
        },
    ];

    const data = items?.length ? items : defaultItems;

    return (
        <View style={styles.container} pointerEvents="none">
        {data.map((item, index) => (
            <Image
            key={index}
            source={{ uri: item.uri }}
            style={styles[item.styleKey]}
            />
        ))}
    </View>
    );
}