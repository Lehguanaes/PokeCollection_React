/*
 * Oferece a ilustração vetorial reutilizável de uma Pokébola.
 * É importada pelo menu e pelo indicador de carregamento.
 * Desenha o símbolo em SVG e respeita o tamanho informado.
 */
import * as React from "react"
import Svg, { Path, Circle, G } from "react-native-svg"
import { Colors } from '@/constants/colors';

/**
 * Desenha uma Pokébola vetorial quadrada. `size` controla largura e altura em
 * conjunto, enquanto o viewBox mantém as proporções em qualquer escala.
 */
export function Pokeball({ size }: { size: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <G>
                {/* O círculo branco forma a base e a metade inferior do desenho. */}
                <Circle cx="12" cy="12" r="10" fill={Colors.white} />

                {/* Este caminho preenche somente o semicírculo superior em vermelho. */}
                <Path
                d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12H2Z"
                fill={Colors.pokeballRed}
                />

                {/* Contorno e linha central definem a estrutura externa da Pokébola. */}
                <Circle cx="12" cy="12" r="10" stroke={Colors.black} strokeWidth="2" />
                <Path d="M2 12H22" stroke={Colors.black} strokeWidth="2" />

                {/* Os círculos concêntricos completam o botão central característico. */}
                <Circle cx="12" cy="12" r="3" fill={Colors.white} stroke={Colors.black} strokeWidth="2" />
                <Circle cx="12" cy="12" r="1" fill={Colors.white} />
            </G>
        </Svg>
    )
}
