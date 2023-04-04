import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({
    getPokedex: builder.query({
      query: () => `pokemon/?limit=151`,
      transformResponse: (response) =>
        response.results.map(({ name, url }) => {
          return { name: name, url: url, id: url.split("/")[6] };
        }),
      transformErrorResponse: (response) => response.status,
      queryTag: "pokedex",
    }),
    getPokemonById: builder.query({
      query: (name) => `pokemon/${name}`,
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response.status,
      queryTag: "pokemon",
    }),
    getPokemonSpecies: builder.query({
      query: (pokemonId) => `pokemon-species/${pokemonId}`,
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response.status,
      queryTag: "pokemon",
    }),
    getPokemonEvolutionChain: builder.query({
      query: (id) => `evolution-chain/${id}`,
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response.status,
      queryTag: "pokemon",
    }),
  }),
});

export const {
  useGetPokedexQuery,
  useGetPokemonByIdQuery,
  useGetPokemonSpeciesQuery,
  useGetPokemonEvolutionChainQuery,
} = pokemonApi;
