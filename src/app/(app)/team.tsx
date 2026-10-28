/*
 * Esta tela organiza os seis espaços do time do treinador.
 * Ela aparece na rota /team dentro do layout autenticado.
 * Atualiza integrantes, abre detalhes e confirma remoções do time.
 */
// Hooks e primitivas visuais sustentam estado, atualização ao foco e responsividade.
import React, { useCallback, useState } from 'react';
import {
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';

// Tipos e componentes de domínio representam integrantes e ações do time.
import { CapturedPokemon, MAX_TEAM_SIZE } from '@/@types/collection';
import { Alert } from '@/components/alert';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { IconButton } from '@/components/iconButton';
import { Loading } from '@/components/loading';
import { DetailsModal } from '@/components/detailsModal';
import { Heading } from '@/components/heading';
import { Colors } from '@/constants/colors';
// A coleção centraliza a persistência, evitando que esta tela altere dados diretamente.
import { useCollection } from '@/context/CollectionContext';

// Uma única estrutura atende avisos de sucesso, atenção e erro após operações no time.
type Notice = {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

export default function Team() {
  const router = useRouter();
  const { team, loading, refresh, removeFromTeam } = useCollection();
  const { width } = useWindowDimensions();
  // Quantidade e largura das colunas preservam cartões legíveis em diferentes telas.
  const columns = width >= 1080 ? 3 : width >= 700 ? 2 : 1;
  const slotWidth = columns === 1 ? '100%' : columns === 2 ? '48%' : '31%';
  // Estados distintos evitam misturar detalhes, confirmação de remoção e resposta da operação.
  const [selectedPokemon, setSelectedPokemon] = useState<CapturedPokemon | null>(null);
  const [removeTarget, setRemoveTarget] = useState<CapturedPokemon | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Atualiza o time ao retornar à tela, pois ele pode ter mudado pela Pokédex.
  useFocusEffect(
    useCallback(() => {
      void refresh().catch((error) => {
        console.error('Erro ao atualizar time:', error);
      });
    }, [refresh])
  );

  // Remove de forma assíncrona e transforma cada resultado em uma mensagem compreensível.
  const handleRemove = useCallback(
    async (pokemon: CapturedPokemon) => {
      try {
        const removed = await removeFromTeam(pokemon.index);
        setSelectedPokemon(null);
        setNotice({
          title: removed ? 'Time atualizado' : 'Pokémon não encontrado',
          message: removed
            ? `${pokemon.nome} foi removido do time, mas continua na sua Pokédex.`
            : `${pokemon.nome} já não faz parte do time.`,
          type: removed ? 'success' : 'warning',
        });
      } catch (error) {
        console.error('Erro ao remover Pokémon do time:', error);
        setSelectedPokemon(null);
        setNotice({
          title: 'Não foi possível atualizar o time',
          message: 'Tente novamente em instantes.',
          type: 'error',
        });
      }
    },
    [removeFromTeam]
  );

  // Na primeira carga, a tela cheia impede que vagas vazias apareçam antes dos dados reais.
  if (loading && !team.length) return <Loading />;

  // Completa o time com posições nulas para sempre apresentar as seis vagas disponíveis.
  const slots = Array.from({ length: MAX_TEAM_SIZE }, (_, index) => team[index] ?? null);

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <Heading
          title="Meu time"
          subtitle={`${team.length}/${MAX_TEAM_SIZE} integrantes escolhidos`}
          style={styles.heading}
        />

        {/* Cada vaga mostra um integrante existente ou conduz à Pokédex para escolher um. */}
        <View style={styles.slots}>
          {slots.map((pokemon, index) => (
            <View
              key={pokemon?.index ?? `empty-${index}`}
              style={[styles.slot, { width: slotWidth }]}
            >
              <Text style={styles.slotNumber}>Vaga {index + 1}</Text>
              {pokemon ? (
                <Card
                  pokemon={pokemon}
                  onPressDetails={() => setSelectedPokemon(pokemon)}
                  footerActions={
                    <IconButton
                      tone="danger"
                      onPress={() => setRemoveTarget(pokemon)}
                      accessibilityLabel={`Remover ${pokemon.nome} do time`}
                      icon={<Trash2 size={17} color={Colors.title} />}
                    />
                  }
                />
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.emptySlot,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => router.replace('/pokedex')}
                  accessibilityRole="button"
                  accessibilityLabel={`Escolher Pokémon para a vaga ${index + 1}`}
                >
                  <Text style={styles.plus}>+</Text>
                  <Text style={styles.emptyTitle}>Vaga disponível</Text>
                  <Text style={styles.emptyText}>Escolher na Pokédex</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        <Footer />
      </ScrollView>

      {/* O modal permite consultar o integrante sem abandonar a composição do time. */}
      <DetailsModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />

      {/* A confirmação protege contra remoções acidentais, mas esclarece que a captura permanece. */}
      <Alert
        title="Remover do time?"
        message={
          removeTarget
            ? `Deseja mesmo remover ${removeTarget.nome} do seu time? Ele continuará na sua Pokédex.`
            : ''
        }
        type="warning"
        visible={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        actions={[
          {
            label: 'Cancelar',
            variant: 'secondary',
            onPress: () => setRemoveTarget(null),
          },
          {
            label: 'Remover',
            variant: 'danger',
            onPress: () => {
              const pokemon = removeTarget;
              setRemoveTarget(null);
              if (pokemon) void handleRemove(pokemon);
            },
          },
        ]}
      />

      {/* Este segundo alerta comunica o resultado final da tentativa de remoção. */}
      <Alert
        title={notice?.title ?? ''}
        message={notice?.message ?? ''}
        type={notice?.type}
        visible={Boolean(notice)}
        onClose={() => setNotice(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Base rolável que permite ao rodapé acompanhar páginas com poucos integrantes.
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  heading: {
    marginTop: 10,
    marginBottom: 22,
  },
  // Grade responsiva e identificação visual de cada uma das seis vagas.
  slots: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 20,
    paddingHorizontal: 18,
    marginBottom: 30,
  },
  slot: {
    minWidth: 270,
    maxWidth: 340,
    alignItems: 'center',
  },
  slotNumber: {
    color: Colors.subtitle,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  // Estado vazio funciona como convite clicável para completar o time.
  emptySlot: {
    width: Platform.OS === 'web' ? 260 : 320,
    maxWidth: '100%',
    minHeight: Platform.OS === 'web' ? 360 : 148,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: Colors.inputBorder,
    borderRadius: 28,
    backgroundColor: Colors.alpha.white72,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  plus: {
    color: Colors.primary,
    fontSize: 54,
    fontWeight: '300',
    lineHeight: 58,
  },
  emptyTitle: {
    color: Colors.title,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyText: {
    color: Colors.subtitle,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 7,
    textAlign: 'center',
  },
  // Feedback discreto confirma o toque sem deslocar o conteúdo.
  buttonPressed: {
    opacity: 0.7,
  },
});
