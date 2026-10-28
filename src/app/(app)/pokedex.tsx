/*
 * Esta tela apresenta a coleção capturada pelo treinador.
 * Ela aparece na rota /pokedex dentro do layout autenticado.
 * Sincroniza capturas e permite consultar, escalar ou descartar Pokémon.
 */
// Hooks controlam seleção, confirmações e sincronização sempre que a rota ganha foco.
import React, { useCallback, useState } from 'react';
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ShieldCheck, ShieldPlus, Trash2 } from 'lucide-react-native';

// Tipos e componentes de domínio montam os cartões e os diálogos da coleção.
import { CapturedPokemon } from '@/@types/collection';
import { Alert } from '@/components/alert';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { IconButton } from '@/components/iconButton';
import { List } from '@/components/list';
import { Loading } from '@/components/loading';
import { DetailsModal } from '@/components/detailsModal';
import { Heading } from '@/components/heading';
import { StateCard } from '@/components/stateCard';
import { Colors } from '@/constants/colors';
// Autenticação personaliza o título; a coleção executa todas as alterações persistentes.
import { useAuth } from '@/context/AuthContext';
import { useCollection } from '@/context/CollectionContext';

// O aviso pós-operação compartilha um formato único entre resultados positivos e falhas.
type Notice = {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

export default function Pokedex() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    captures,
    loading,
    refresh,
    addToTeam,
    discard,
    isInTeam,
  } = useCollection();
  const { width } = useWindowDimensions();
  const isAndroid = Platform.OS === 'android';
  // A grade ganha colunas conforme o espaço disponível sem comprimir os cartões.
  const columns = width >= 1120 ? 3 : width >= 760 ? 2 : 1;
  // Cada estado representa um propósito de interface: detalhes, confirmações e resposta final.
  const [selectedPokemon, setSelectedPokemon] = useState<CapturedPokemon | null>(null);
  const [teamTarget, setTeamTarget] = useState<CapturedPokemon | null>(null);
  const [discardTarget, setDiscardTarget] = useState<CapturedPokemon | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Recarrega ao voltar para a Pokédex, mantendo-a coerente com câmera, time e descarte.
  useFocusEffect(
    useCallback(() => {
      void refresh().catch((error) => {
        console.error('Erro ao atualizar coleção:', error);
      });
    }, [refresh])
  );

  // Trata os resultados possíveis da inclusão e só navega quando a operação realmente funciona.
  const handleAddToTeam = useCallback(
    async (pokemon: CapturedPokemon) => {
      try {
        const result = await addToTeam(pokemon.index);
        setSelectedPokemon(null);

        if (result === 'added') {
          router.replace('/team');
          return;
        }

        setNotice({
          title: result === 'full' ? 'Time completo' : 'Pokémon já selecionado',
          message:
            result === 'full'
              ? 'Seu time já tem seis Pokémon. Remova um integrante antes de adicionar outro.'
              : `${pokemon.nome} já faz parte do seu time.`,
          type: 'warning',
        });
      } catch (error) {
        console.error('Erro ao adicionar Pokémon ao time:', error);
        setSelectedPokemon(null);
        setNotice({
          title: 'Não foi possível atualizar o time',
          message: 'Tente novamente em instantes.',
          type: 'error',
        });
      }
    },
    [addToTeam, router]
  );

  // Guarda o alvo antes de fechar a confirmação para concluir o descarte com uma referência estável.
  const confirmDiscard = useCallback(async () => {
    const pokemon = discardTarget;
    setDiscardTarget(null);
    if (!pokemon) return;

    try {
      const removed = await discard(pokemon.index);
      setNotice({
        title: removed ? 'Captura descartada' : 'Captura não encontrada',
        message: removed
          ? `${pokemon.nome} foi removido da sua coleção e do time.`
          : 'A coleção já não contém este Pokémon.',
        type: removed ? 'success' : 'warning',
      });
    } catch (error) {
      console.error('Erro ao descartar Pokémon:', error);
      setNotice({
        title: 'Não foi possível descartar',
        message: 'Tente novamente em instantes.',
        type: 'error',
      });
    }
  }, [discard, discardTarget]);

  // Cada cartão combina consulta de detalhes com ações específicas da coleção e do time.
  const renderPokemonCard = useCallback(
    (item: CapturedPokemon) => {
      const inTeam = isInTeam(item.index);

      return (
        <View style={styles.cardShell}>
          <Card
            pokemon={item}
            onPressDetails={() => setSelectedPokemon(item)}
            footerActions={
              <>
                <IconButton
                  onPress={() => setTeamTarget(item)}
                  disabled={inTeam}
                  accessibilityLabel={
                    inTeam ? `${item.nome} já está no time` : `Adicionar ${item.nome} ao time`
                  }
                  icon={inTeam ? (
                    <ShieldCheck size={18} color={Colors.gray[500]} />
                  ) : (
                    <ShieldPlus size={18} color={Colors.primary} />
                  )}
                />
                <IconButton
                  tone="danger"
                  onPress={() => setDiscardTarget(item)}
                  accessibilityLabel={`Descartar ${item.nome}`}
                  icon={<Trash2 size={17} color={Colors.title} />}
                />
              </>
            }
          />
        </View>
      );
    },
    [isInTeam]
  );

  // A carga inicial ocupa a tela para não confundir ausência temporária com coleção vazia.
  if (loading && !captures.length) return <Loading />;

  return (
    <Screen>
      <Header />

      <List
        data={captures}
        columns={columns}
        renderItemContent={renderPokemonCard}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Heading
              title={`Pokédex de ${user || 'treinador'}`}
              subtitle="Pokémons capturados pelo leitor de QR Code"
              style={styles.heading}
            />

            {/* O estado vazio oferece uma próxima ação adequada à plataforma atual. */}
            {!captures.length ? (
              <StateCard
                title="Nenhum Pokémon capturado ainda"
                message={
                  isAndroid
                    ? 'Abra a câmera, escaneie um QR Code e faça sua primeira captura.'
                    : 'Explore o catálogo de Pokémon. Suas capturas feitas no aplicativo Android aparecerão aqui.'
                }
                action={
                  isAndroid
                    ? {
                        title: 'Abrir câmera',
                        onPress: () => router.replace('/camera'),
                        accessibilityLabel: 'Abrir câmera',
                      }
                    : {
                        title: 'Explorar Pokémon',
                        onPress: () => router.replace('/pokemon'),
                      }
                }
                style={styles.emptyCard}
              />
            ) : null}
          </View>
        }
        ListFooterComponent={<Footer />}
      />

      {/* Detalhes permanecem sobre a lista para preservar o ponto de navegação do usuário. */}
      <DetailsModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />

      {/* Confirma a entrada no time antes de executar uma alteração persistente. */}
      <Alert
        title="Adicionar ao time?"
        message={
          teamTarget
            ? `Deseja mesmo adicionar ${teamTarget.nome} ao seu time?`
            : ''
        }
        type="warning"
        visible={Boolean(teamTarget)}
        onClose={() => setTeamTarget(null)}
        actions={[
          {
            label: 'Cancelar',
            variant: 'secondary',
            onPress: () => setTeamTarget(null),
          },
          {
            label: 'Adicionar',
            variant: 'primary',
            onPress: () => {
              const pokemon = teamTarget;
              setTeamTarget(null);
              if (pokemon) void handleAddToTeam(pokemon);
            },
          },
        ]}
      />

      {/* O descarte recebe confirmação própria porque também pode remover o Pokémon do time. */}
      <Alert
        title="Descartar captura?"
        message={
          discardTarget
            ? `${discardTarget.nome} será removido da sua coleção. Se estiver no time, também será removido de lá.`
            : ''
        }
        type="warning"
        visible={Boolean(discardTarget)}
        onClose={() => setDiscardTarget(null)}
        actions={[
          {
            label: 'Cancelar',
            variant: 'secondary',
            onPress: () => setDiscardTarget(null),
          },
          {
            label: 'Descartar',
            variant: 'danger',
            onPress: () => void confirmDiscard(),
          },
        ]}
      />

      {/* O aviso final centraliza o retorno de sucesso, limite, duplicidade ou erro. */}
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
  // Espaçamento da lista e do cabeçalho mantém título e estado vazio alinhados aos cartões.
  scrollContent: {
    paddingBottom: 0,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  heading: {
    marginBottom: 20,
  },
  // Invólucro dos cartões e apresentação destacada da coleção vazia.
  cardShell: {
    alignItems: 'center',
    marginBottom: 28,
  },
  emptyCard: {
    maxWidth: 520,
    borderRadius: 24,
    padding: 22,
    marginTop: 8,
  },
});
