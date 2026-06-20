import { ImageSourcePropType } from 'react-native';

import { Poder } from '@/@types/pokemon';

export interface PokemonCardProps {
  title: string;
  image:
    | ImageSourcePropType
    | {
        uri: string;
      };
  tipos?: string[];
  poderes?: Poder[];
  index?: number;
  showDetailsButton?: boolean;
  animated?: boolean;
}
