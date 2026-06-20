import { Platform } from 'react-native';

import { PokemonCard as PokemonCardAndroid } from './index.android';
import { PokemonCard as PokemonCardIOS } from './index.ios';
import { PokemonCard as PokemonCardWeb } from './index.web';
import { PokemonCardProps } from './types';

export { PokemonCardImplementation as PokemonCard };
export * from './types';

const PokemonCardImplementation = Platform.select({
  ios: PokemonCardIOS,
  android: PokemonCardAndroid,
  web: PokemonCardWeb,
  default: PokemonCardWeb,
}) as React.FC<PokemonCardProps>;
