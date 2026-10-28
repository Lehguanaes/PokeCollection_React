/*
 * Implementa o modal com informações completas de um Pokémon.
 * É usado nas telas de Pokédex, catálogo, time e mapa.
 * Localiza dados, exibe atributos e serializa ações configuráveis.
 */
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Pokemon } from '@/@types/pokemon';
import { Button } from '@/components/button';
import { Colors, withAlpha } from '@/constants/colors';
import { ABILITY_MAP, TYPE_COLORS, TYPE_MAP } from '@/constants/pokemon';

import { styles } from './styles';

/** Variantes visuais aceitas pelas ações exibidas no rodapé do modal. */
export type DetailsActionVariant =
  | 'primary'
  | 'secondary'
  | 'danger';

/**
 * Descreve uma ação de domínio disponível para o Pokémon aberto.
 * O handler pode ser assíncrono para que o modal bloqueie concorrência e apresente carregamento.
 */
export interface DetailsAction {
  label: string;
  onPress: (pokemon: Pokemon) => void | Promise<void>;
  variant?: DetailsActionVariant;
  disabled?: boolean;
  accessibilityLabel?: string;
}

/**
 * Contrato controlado do modal: `pokemon` define conteúdo e visibilidade, enquanto
 * fechamento e ações permanecem sob responsabilidade da tela consumidora.
 */
export interface DetailsModalProps {
  pokemon: Pokemon | null;
  onClose: () => void;
  actions?: DetailsAction[];
}

// Ordem canônica e rótulos em português usados para projetar os atributos vindos da API.
const STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Ataque' },
  { key: 'defense', label: 'Defesa' },
  { key: 'special-attack', label: 'Atq. especial' },
  { key: 'special-defense', label: 'Def. especial' },
  { key: 'speed', label: 'Velocidade' },
] as const;

function localizeType(type: string) {
  // Preserva tipos desconhecidos para que novos valores da API continuem visíveis.
  return TYPE_MAP[type] ?? type;
}

function formatAbility(ability: string) {
  // Usa tradução conhecida ou humaniza o slug; por fim normaliza a inicial para exibição.
  const formatted = ABILITY_MAP[ability] ?? ability.replace(/-/g, ' ');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function DetailsModal({
  pokemon,
  onClose,
  actions = [],
}: DetailsModalProps) {
  // Dimensões atuais determinam responsividade e altura máxima sem depender de valores globais.
  const { height, width } = useWindowDimensions();
  // Guarda o índice em execução para bloquear ações concorrentes e marcar apenas seu botão como loading.
  const [busyAction, setBusyAction] = useState<number | null>(null);
  const visible = pokemon !== null;

  // Trocar de Pokémon encerra qualquer estado visual de operação pertencente ao conteúdo anterior.
  useEffect(() => {
    setBusyAction(null);
  }, [pokemon]);

  // Sem entidade selecionada não há conteúdo nem modal residual na árvore.
  if (!pokemon) return null;

  // Valores derivados adaptam o domínio uma única vez por render para identidade, layout e apresentação.
  const localizedTypes = pokemon.tipos.map(localizeType);
  const accentColor = TYPE_COLORS[localizedTypes[0]] ?? Colors.title;
  const isMobile = width < 600;
  const paddedIndex = pokemon.index.toString().padStart(3, '0');

  // Serializa ações assíncronas, captura falhas para diagnóstico e sempre libera a interface ao concluir.
  const runAction = async (
    action: DetailsAction,
    actionIndex: number
  ) => {
    if (busyAction !== null || action.disabled) return;

    setBusyAction(actionIndex);
    try {
      await action.onPress(pokemon);
    } catch (error) {
      console.error('Erro ao executar ação do Pokémon:', error);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    // O modal bloqueia fechamento pelo sistema ou backdrop enquanto uma ação está em andamento.
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={busyAction === null ? onClose : undefined}
    >
      <View style={styles.backdrop}>
        {/* Área invisível atrás do painel permite dispensar o modal sem competir com seu conteúdo. */}
        <Pressable
          style={styles.backdropDismiss}
          onPress={busyAction === null ? onClose : undefined}
          accessibilityLabel="Fechar detalhes do Pokémon"
        />

        {/* Painel responsivo: reduz raios no mobile, respeita a janela e herda a cor do primeiro tipo. */}
        <View
          style={[
            styles.modal,
            isMobile && styles.modalMobile,
            { borderTopColor: accentColor, maxHeight: height - 32 },
          ]}
        >
          {/* Fechamento explícito permanece acessível, mas também é bloqueado durante ações assíncronas. */}
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.pressed,
            ]}
            onPress={onClose}
            disabled={busyAction !== null}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>

          {/* Rolagem contém todo o conteúdo quando a janela é menor que o painel ideal. */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={isMobile}
            bounces={false}
          >
            {/* Hero: combina retrato temático, identidade, tipos e medidas convertidas da unidade da API. */}
            <View style={[styles.hero, isMobile && styles.heroMobile]}>
              <View
                style={[
                  styles.imageHalo,
                  {
                    backgroundColor: withAlpha(accentColor, 0.09),
                    borderColor: withAlpha(accentColor, 0.33),
                  },
                ]}
              >
                <Image
                  source={{ uri: pokemon.imagem }}
                  style={styles.image}
                  resizeMode="contain"
                  accessibilityLabel={`Imagem oficial de ${pokemon.nome}`}
                />
              </View>

              <View style={styles.identity}>
                <Text style={[styles.index, { color: accentColor }]}>#{paddedIndex}</Text>
                <Text style={styles.name}>{pokemon.nome}</Text>

                <View style={styles.types}>
                  {localizedTypes.map((type) => {
                    const typeColor = TYPE_COLORS[type] ?? accentColor;
                    return (
                      <View
                        key={type}
                        style={[
                          styles.typeBadge,
                          {
                            backgroundColor: withAlpha(typeColor, 0.13),
                            borderColor: typeColor,
                          },
                        ]}
                      >
                        <Text style={[styles.typeText, { color: typeColor }]}>
                          {type}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.measurements}>
                  <View style={styles.measurementCard}>
                    <Text style={styles.measurementLabel}>Altura</Text>
                    <Text style={styles.measurementValue}>
                      {pokemon.altura == null ? '—' : `${(pokemon.altura / 10).toFixed(1)} m`}
                    </Text>
                  </View>
                  <View style={styles.measurementCard}>
                    <Text style={styles.measurementLabel}>Peso</Text>
                    <Text style={styles.measurementValue}>
                      {pokemon.peso == null ? '—' : `${(pokemon.peso / 10).toFixed(1)} kg`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Habilidades: traduz slugs conhecidos e comunica explicitamente quando a lista está ausente. */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Habilidades</Text>
              <View style={styles.abilities}>
                {pokemon.habilidades?.length ? (
                  pokemon.habilidades.map((ability) => (
                    <View key={ability} style={styles.abilityBadge}>
                      <Text style={styles.abilityText}>{formatAbility(ability)}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>Não informadas</Text>
                )}
              </View>
            </View>

            {/* Atributos: segue ordem canônica e converte cada valor em uma barra limitada a 100%. */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Atributos base</Text>
              <View style={styles.stats}>
                {STATS.map((stat) => {
                  const value =
                    pokemon.poderes.find((item) => item.nome === stat.key)?.forca ?? 0;
                  // A referência 180 dá escala visual uniforme sem permitir que valores altos estourem o trilho.
                  const percentage = `${Math.min((value / 180) * 100, 100)}%` as `${number}%`;

                  return (
                    <View key={stat.key} style={styles.statRow}>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                      <View style={styles.statTrack}>
                        <View
                          style={[
                            styles.statFill,
                            { backgroundColor: accentColor, width: percentage },
                          ]}
                        />
                      </View>
                      <Text style={styles.statValue}>{value}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Ações: aplica variantes, estado de carregamento e bloqueio global para impedir duplo envio. */}
            {actions.length ? (
              <View style={styles.actions}>
                {actions.map((action, actionIndex) => {
                  const variant = action.variant ?? 'primary';
                  const isBusy = busyAction === actionIndex;
                  const disabled = busyAction !== null || action.disabled;

                  return (
                    <Button
                      key={`${variant}-${action.label}`}
                      title={action.label}
                      variant={variant}
                      size="small"
                      fullWidth={false}
                      style={styles.actionButton}
                      onPress={() => void runAction(action, actionIndex)}
                      disabled={disabled}
                      loading={isBusy}
                      accessibilityLabel={action.accessibilityLabel ?? action.label}
                    />
                  );
                })}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default DetailsModal;
