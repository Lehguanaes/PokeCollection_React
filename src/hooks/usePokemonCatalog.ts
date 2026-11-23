import { useEffect, useState } from 'react';
import { Pokemon } from '@/@types/pokemon';
import { getPokemonCatalog, getPokemonIdsByType, getPokemonsByIds } from '@/integration/pokemonIntegration';

const PAGE_SIZE = 12;

export function usePokemonCatalog() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [page, setPage] = useState(1);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(function loadCatalog() {
    let active = true;
    setLoading(true);
    setError(false);
    setPokemons([]);

    async function load() {
      try {
        const catalog = await getPokemonCatalog();
        const typeIds = selectedType === 'all' ? null : await getPokemonIdsByType(selectedType);
        const query = search.trim().toLowerCase();
        const filtered = catalog.filter((pokemon) => {
          const matchesType = !typeIds || typeIds.has(pokemon.id);
          const matchesSearch = /^\d+$/.test(query)
            ? pokemon.id === Number(query)
            : pokemon.name.toLowerCase().includes(query);
          return matchesType && matchesSearch;
        });
        const ids = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((pokemon) => pokemon.id);
        const details = await getPokemonsByIds(ids);
        if (active) {
          setPokemons(details);
          setTotalResults(filtered.length);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    // Ignora uma resposta antiga se o usuário mudar o filtro ou sair da tela.
    return () => { active = false; };
  }, [search, selectedType, page, retryCount]);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeType(value: string) {
    setSelectedType(value);
    setPage(1);
  }

  function retry() {
    setRetryCount((value) => value + 1);
  }

  return {
    pokemons,
    search,
    selectedType,
    page,
    pageCount: Math.ceil(totalResults / PAGE_SIZE),
    totalResults,
    firstResult: totalResults ? (page - 1) * PAGE_SIZE + 1 : 0,
    lastResult: Math.min(page * PAGE_SIZE, totalResults),
    loading,
    error,
    empty: !loading && !error && totalResults === 0,
    changeSearch,
    changeType,
    setPage,
    retry,
  };
}
