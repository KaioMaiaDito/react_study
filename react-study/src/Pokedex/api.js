import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({
    getPokedex: builder.query({
      query: () => `pokemon/?limit=151`,
      transformResponse: (response, meta, arg) => response.results,
      transformErrorResponse: (response, meta, arg) => response.status,
      queryTag: "pokedex",
    }),
    getPokemonByName: builder.query({
      query: (name) => `pokemon/${name}`,
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.status,
      queryTag: "pokemon",
    }),
    getPokemonSpecies: builder.query({
      query: (pokemonId) => `pokemon-species/${pokemonId}`,
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.status,
      queryTag: "pokemon",
    }),
    getPokemonEvolutionChain: builder.query({
      query: (id) => `evolution-chain/${id}`,
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.status,
      queryTag: "pokemon",
    }),
    getPokemonByUrl: builder.query({
      query: (url) => url,
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.status,
      queryTag: "pokemon",
    }),
  }),
});

export const {
  useGetPokedexQuery,
  useGetPokemonByNameQuery,
  useGetPokemonSpeciesQuery,
  useGetPokemonByUrlQuery,
  useGetPokemonEvolutionChainQuery,
} = pokemonApi;
