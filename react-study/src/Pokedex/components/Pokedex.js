import { useState } from "react";
import { useGetPokedexQuery } from "../api.js";

import styled from "styled-components";
import { CardPokemonContainer } from "./CardPokemon.js";

export function Pokedex() {
  const [pokemonForSearch, setPokemonForSearch] = useState("");
  const { data, isLoading, isError, isFetching, refetch } =
    useGetPokedexQuery();

  const changePokemonSearch = (event) => {
    event.preventDefault();
    setPokemonForSearch(event.target.value);
  };

  if (isError)
    return (
      <>
        <h1>Error</h1>
        <button onClick={() => refetch()}>Try Again</button>
      </>
    );

  if (isLoading) return <h1>Loading...</h1>;
  if (isFetching) return <></>;

  const pokedexData = data;

  return (
    <>
      <input
        name="pokemonSearch"
        value={pokemonForSearch}
        type="text"
        placeholder="Procure o pokemon"
        onChange={changePokemonSearch}
      />
      <button>SEARCH</button>
      <PokedexWrapper>
        {pokedexData
          .filter((el) =>
            el.name.toLowerCase().includes(pokemonForSearch.toLowerCase())
          )
          .map((element) => {
            return <CardPokemonContainer key={element.id} id={element.id} />;
          })
          .sort((a, b) => a.id - b.id)}
      </PokedexWrapper>
    </>
  );
}

const PokedexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: stretch;
  justify-content: space-between;
  align-items: stretch;
`;
