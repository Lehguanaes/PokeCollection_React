/*
 * Este layout protege o conjunto principal de telas do aplicativo.
 * Ele envolve as rotas do grupo autenticado em src/app/(app).
 * Aguarda a sessão, redireciona visitantes e configura a pilha de navegação.
 */
// O Expo Router controla a pilha e os redirecionamentos deste grupo protegido.
import { Stack, Redirect } from "expo-router";
// Estes elementos formam a espera visual enquanto a sessão ainda está sendo recuperada.
import { ActivityIndicator, View } from "react-native";
// O contexto informa se a navegação pode liberar as telas privadas.
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/colors";

// Grupo de rotas autenticadas: pokedex, time, catálogo, câmera, mapa, perfil.
// Se alguém abrir /pokedex sem sessão, volta para a tela de login ("/").
export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    // Enquanto a sessão ainda é verificada, não decide o redirecionamento.
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={Colors.black} />
            </View>
        );
    }

    // Sem uma sessão válida, impede que qualquer tela privada chegue a ser montada.
    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    // Stack sem header nativo: cada tela usa o Header/Menu próprios.
    return <Stack screenOptions={{headerShown: false}} />;
}
