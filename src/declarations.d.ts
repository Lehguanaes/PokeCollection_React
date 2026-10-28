/*
 * Este arquivo declara ao TypeScript os módulos de recursos visuais.
 * Ele está presente na compilação e atende imports de imagens e SVGs nas telas.
 * Ele associa cada extensão ao tipo esperado pelos componentes React Native.
 */
// Ensina ao TypeScript que o transformador de assets entrega cada SVG como um
// componente React Native tipado, permitindo importar o arquivo diretamente no JSX.
declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
}

// Imagens rasterizadas são resolvidas pelo bundler como fontes aceitas pelo
// componente `Image`, e não como caminhos de arquivo em formato de string.
declare module "*.png" {
    const value: import('react-native').ImageSourcePropType;
    export default value;
}

// Mantém para arquivos JPG a mesma tipagem de fonte usada pelo React Native.
declare module "*.jpg" {
    const value: import('react-native').ImageSourcePropType;
    export default value;
}

// Cobre também a extensão JPEG longa para que ambas as grafias sejam importáveis.
declare module "*.jpeg" {
    const value: import('react-native').ImageSourcePropType;
    export default value;
}
