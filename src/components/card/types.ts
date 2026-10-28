/*
 * Declara o contrato público compartilhado pelos cartões de Pokémon.
 * É importado pelas implementações web e nativa do módulo.
 * Tipifica o Pokémon, a ação de detalhes e o rodapé extensível.
 */
import { ReactNode } from 'react';

import { Pokemon } from '@/@types/pokemon';

/**
 * Interface pública compartilhada pelas implementações web, Android e iOS do cartão.
 * O callback recebe o objeto completo para que a tela chamadora não precise reconstruir
 * contexto, enquanto footerActions permite compor ações sem acoplar o cartão a um fluxo.
 */
export interface CardProps {
  pokemon: Pokemon;
  onPressDetails?: (pokemon: Pokemon) => void;
  footerActions?: ReactNode;
}
