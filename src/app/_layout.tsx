/*
 * Este é o layout raiz de toda a navegação do aplicativo.
 * Ele envolve as rotas públicas e autenticadas sob src/app.
 * Disponibiliza os contextos de sessão e coleção antes de renderizar a rota.
 */
// Os providers disponibilizam sessão e coleção para qualquer rota renderizada pelo app.
import { useAsyncStorageDevTools } from '@dev-plugins/async-storage';
import { AuthProvider } from '@/context/AuthContext';
import { CollectionProvider } from '@/context/CollectionContext';
// O Slot é o ponto em que o Expo Router encaixa a tela correspondente à URL atual.
import { Slot } from 'expo-router';

// Layout raiz do Expo Router: envolve TODA a navegação.
// Auth fica por fora porque as rotas (auth vs app) dependem de "está logado?".
// Collection fica dentro do Auth porque a Pokédex/time são por userId.
export default function Root() {
  useAsyncStorageDevTools({
    errorHandler: (error) => {
      console.error('Erro no AsyncStorage DevTools:', error);
    },
  });

  return (
    <AuthProvider>
      <CollectionProvider>
        {/* Slot renderiza a rota atual: (auth) na entrada ou (app) depois do login. */}
        <Slot />
      </CollectionProvider>
    </AuthProvider>
  );
}
