/*
 * Esta tela reúne os dados e o progresso do treinador autenticado.
 * Ela aparece na rota /profile dentro do layout principal.
 * Atualiza a coleção, exibe a identidade da conta e encerra a sessão.
 */
// Hooks do React sustentam a atualização ao focar a tela e o layout responsivo.
import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

// Componentes compartilhados mantêm a estrutura visual consistente com as demais telas.
import { Screen } from '@/components/screen';
import { Button } from '@/components/button';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Heading } from '@/components/heading';
import { Colors } from '@/constants/colors';
// Os contextos fornecem a identidade autenticada e os dados atuais da coleção.
import { useAuth } from '@/context/AuthContext';
import { useCollection } from '@/context/CollectionContext';

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { captures, refresh } = useCollection();
  const { width } = useWindowDimensions();
  // A largura define apenas ajustes de apresentação, sem criar versões diferentes da tela.
  const isMobile = width < 560;

  // Reconsulta a coleção sempre que o perfil volta ao foco para exibir uma contagem atualizada.
  useFocusEffect(
    useCallback(() => {
      void refresh().catch((error) => {
        console.error('Erro ao atualizar perfil:', error);
      });
    }, [refresh])
  );

  // Encerra a sessão antes de voltar à entrada para não deixar uma rota privada ativa.
  async function handleDisconnect() {
    await signOut();
    router.replace('/');
  }

  return (
    <Screen>
      {/* A rolagem reúne cabeçalho, cartão de perfil e rodapé em uma página responsiva. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <Heading
          title="Perfil"
          subtitle="Informações da sua conta"
          style={styles.heading}
        />

        {/* O cartão central resume identidade, usuário e progresso da coleção. */}
        <View style={styles.content}>
          <View style={[styles.card, isMobile && styles.cardMobile]}>
            <View style={styles.identityMark}>
              <Text style={styles.identityInitial}>
                {(user?.trim().charAt(0) || 'T').toUpperCase()}
              </Text>
            </View>

            <Text style={[styles.name, isMobile && styles.nameMobile]}>
              {user || 'Treinador'}
            </Text>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nome de usuário</Text>
                <Text style={styles.detailValue}>{user || 'Não informado'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pokémon capturados</Text>
                <Text style={styles.captureCount}>{captures.length}/151</Text>
              </View>
            </View>

            {/* A ação destrutiva fica separada dos dados para deixar clara a saída da conta. */}
            <Button
              title="Desconectar"
              variant="danger"
              style={styles.disconnectButton}
              onPress={() => void handleDisconnect()}
              accessibilityLabel="Desconectar da conta"
            />
          </View>
        </View>

        <Footer />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Estrutura da página rolável e alinhamento do conteúdo principal.
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  heading: {
    marginTop: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 38,
  },
  // Cartão de identidade e sua adaptação para telas estreitas.
  card: {
    width: '100%',
    maxWidth: 680,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.white,
    padding: 38,
    alignItems: 'center',
  },
  cardMobile: {
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  // Marca visual e nome usados para reconhecer rapidamente o treinador.
  identityMark: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: Colors.primary,
    borderWidth: 5,
    borderColor: Colors.details,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityInitial: {
    color: Colors.white,
    fontSize: 46,
    fontWeight: '900',
  },
  name: {
    color: Colors.title,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 18,
  },
  nameMobile: {
    fontSize: 24,
  },
  // Quadro de dados, linhas e tipografia que organizam as informações da conta.
  details: {
    width: '100%',
    marginTop: 30,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 20,
  },
  detailRow: {
    minHeight: 74,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  detailLabel: {
    color: Colors.subtitle,
    fontSize: 14,
    fontWeight: '800',
  },
  detailValue: {
    maxWidth: '100%',
    color: Colors.text,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'right',
  },
  captureCount: {
    color: Colors.title,
    fontSize: 21,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.inputBorder,
  },
  // Espaçamento isola a ação de desconexão dos dados informativos.
  disconnectButton: {
    marginTop: 26,
  },
});
