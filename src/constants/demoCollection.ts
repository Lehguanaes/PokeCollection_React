/*
 * Dados demonstrativos usados somente na web quando a coleção real está vazia.
 * Eles permitem apresentar Pokédex, mapa e time mesmo sem captura por câmera.
 */
import { PokemonCollection } from '@/@types/collection';

export const DEMO_COLLECTION: PokemonCollection = {
  captures: [
    {
      index: '25',
      nome: 'pikachu',
      imagem:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      tipos: ['electric'],
      poderes: [
        { nome: 'hp', forca: 35 },
        { nome: 'attack', forca: 55 },
        { nome: 'defense', forca: 40 },
        { nome: 'special-attack', forca: 50 },
        { nome: 'special-defense', forca: 50 },
        { nome: 'speed', forca: 90 },
      ],
      altura: 4,
      peso: 60,
      habilidades: ['static', 'lightning-rod'],
      capturedAt: '2026-09-25T14:20:00.000Z',
      location: {
        latitude: -23.55052,
        longitude: -46.633308,
        accuracy: 18,
        timestamp: 1790346000000,
      },
    },
    {
      index: '1',
      nome: 'bulbasaur',
      imagem:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      tipos: ['grass', 'poison'],
      poderes: [
        { nome: 'hp', forca: 45 },
        { nome: 'attack', forca: 49 },
        { nome: 'defense', forca: 49 },
        { nome: 'special-attack', forca: 65 },
        { nome: 'special-defense', forca: 65 },
        { nome: 'speed', forca: 45 },
      ],
      altura: 7,
      peso: 69,
      habilidades: ['overgrow', 'chlorophyll'],
      capturedAt: '2026-09-24T18:45:00.000Z',
      location: {
        latitude: -23.561684,
        longitude: -46.655981,
        accuracy: 24,
        timestamp: 1790275500000,
      },
    },
    {
      index: '4',
      nome: 'charmander',
      imagem:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
      tipos: ['fire'],
      poderes: [
        { nome: 'hp', forca: 39 },
        { nome: 'attack', forca: 52 },
        { nome: 'defense', forca: 43 },
        { nome: 'special-attack', forca: 60 },
        { nome: 'special-defense', forca: 50 },
        { nome: 'speed', forca: 65 },
      ],
      altura: 6,
      peso: 85,
      habilidades: ['blaze', 'solar-power'],
      capturedAt: '2026-09-23T21:10:00.000Z',
      location: {
        latitude: -23.587416,
        longitude: -46.657634,
        accuracy: 31,
        timestamp: 1790197800000,
      },
    },
    {
      index: '7',
      nome: 'squirtle',
      imagem:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
      tipos: ['water'],
      poderes: [
        { nome: 'hp', forca: 44 },
        { nome: 'attack', forca: 48 },
        { nome: 'defense', forca: 65 },
        { nome: 'special-attack', forca: 50 },
        { nome: 'special-defense', forca: 64 },
        { nome: 'speed', forca: 43 },
      ],
      altura: 5,
      peso: 90,
      habilidades: ['torrent', 'rain-dish'],
      capturedAt: '2026-09-22T16:05:00.000Z',
    },
    {
      index: '133',
      nome: 'eevee',
      imagem:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
      tipos: ['normal'],
      poderes: [
        { nome: 'hp', forca: 55 },
        { nome: 'attack', forca: 55 },
        { nome: 'defense', forca: 50 },
        { nome: 'special-attack', forca: 45 },
        { nome: 'special-defense', forca: 65 },
        { nome: 'speed', forca: 55 },
      ],
      altura: 3,
      peso: 65,
      habilidades: ['run-away', 'adaptability', 'anticipation'],
      capturedAt: '2026-09-21T12:30:00.000Z',
      location: {
        latitude: -23.544846,
        longitude: -46.642685,
        accuracy: 20,
        timestamp: 1790080200000,
      },
    },
  ],
  teamIds: ['25', '1', '4', '133'],
};
