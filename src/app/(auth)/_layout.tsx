/*
 * Este layout controla o acesso às telas públicas de autenticação.
 * Ele envolve a rota inicial do grupo src/app/(auth).
 * Aguarda a sessão e encaminha usuários autenticados para a Pokédex.
 */
// Este layout decide entre renderizar a rota pública ou redirecionar o usuário.
import { Redirect, Slot } from 'expo-router';
// A espera evita mostrar o formulário antes de saber se já existe uma sessão.
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

// Grupo público: só login/cadastro (src/app/(auth)/index.tsx).
// Quem já está logado não deve ver o formulário de novo — vai direto à Pokédex.
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Adia a decisão de navegação para não causar um breve salto entre login e Pokédex.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.black} />
      </View>
    );
  }

  // Uma sessão ativa torna desnecessário e inseguro exibir novamente a entrada pública.
  if (isAuthenticated) {
    return <Redirect href="/pokedex" />;
  }

  // Sem sessão, o Slot libera a tela de login/cadastro deste grupo.
  return <Slot />;
}
