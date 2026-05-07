import { ScrollView, View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { Footer } from "@/components/footer";
import { PokeballHeader } from '@/components/PokeballHeader';
import { List } from '@/components/list';
import { useAuth } from '@/context/AuthContext';
import { styles } from '@/components/dashboard/styles';

export default function Dashboard() {
    const { user, signOut } = useAuth();

    // RESPONSIVIDADE SIMPLES
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 400;

    const posts = [
        {
        id: '1',
        title: 'Charmander',
        description: 'Pokémon de fogo',
        image: require('../../../assets/images/pokemons/charmander.png'),
        },
        {
        id: '2',
        title: 'Blastoise',
        description: 'Pokémon de água',
        image: require('../../../assets/images/pokemons/blastoise.png'),
        },
        {
        id: '3',
        title: 'Bulbasaur',
        description: 'Pokémon planta',
        image: require('../../../assets/images/pokemons/bulbasaur.png'),
        },
        {
        id: '4',
        title: 'Beedrill',
        description: 'Pokémon inseto',
        image: require('../../../assets/images/pokemons/beedrill.png'),
        },
    ];

    return (
        <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        >

        <PokeballHeader />

        {!isSmallScreen && (
            <Image
            source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' }}
            style={styles.pokemon1}
            resizeMode="contain"
            />
        )}

        {!isSmallScreen && (
            <Image
            source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' }}
            style={styles.pokemon2}
            resizeMode="contain"
            />
        )}

        {!isSmallScreen && (
            <Image
            source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' }}
            style={styles.pokemon3}
            resizeMode="contain"
            />
        )}

        {!isSmallScreen && (
            <Image
            source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' }}
            style={styles.pokemon4}
            resizeMode="contain"
            />
        )}

        <View style={styles.content}>
            <Text style={styles.title}>Bem-vindo, {user}</Text>
            <View style={styles.line} />
            <Text style={styles.subtitle}>
            Explore sua coleção de Pokémons ✨
            </Text>

            <List data={posts} onLoadMore={() => {}} />

            <View style={styles.buttonContainer}>
            <Pressable
                onPress={signOut}
                style={({ pressed, hovered }) => [
                styles.logoutButton,
                hovered && styles.buttonHover,
                pressed && styles.buttonPressed,
                ]}
            >
                <Text style={styles.logoutText}>Desconectar</Text>
            </Pressable>
            </View>
        </View>

        <Footer />

        </ScrollView>
    );
}