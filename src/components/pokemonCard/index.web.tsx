import { Card } from '@/components/card';

import { PokemonCardProps } from './types';

export function PokemonCard(props: PokemonCardProps) {
  return <Card {...props} />;
}
