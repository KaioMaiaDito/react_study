import { createContext, useContext, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { useGetPokedexQuery } from "./api.js";

import styled from "styled-components";
import { CardPokemonContainer } from "./components/CardPokemon.js";
import { PokemonInfoContainer } from "./components/PokemonInfo.js";

import store from "./store.js";

const PokedexStore = createContext();
const PokedexStoreProvider = ({ children }) => {
  const [pokemonForSearch, setPokemonForSearch] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  const context = {
    pokemonForSearch,
    setPokemonForSearch,
    isFilter,
    setIsFilter,
  };

  return (
    <PokedexStore.Provider value={context}>{children}</PokedexStore.Provider>
  );
};

function useStore() {
  return useContext(PokedexStore);
}

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/pokedex">Pokedex</Link>
        </li>
      </ul>
    </nav>
  );
}

function SearchPokemon() {
  const { pokemonForSearch, setPokemonForSearch, setIsFilter } = useStore();
  const changePokemonSearch = (event) => {
    event.preventDefault();
    setPokemonForSearch(event.target.value);
  };

  return (
    <>
      <input
        name="pokemonSearch"
        value={pokemonForSearch}
        type="text"
        placeholder="Procure o pokemon"
        onChange={changePokemonSearch}
      />
      {
        <button
          onClick={() => {
            setIsFilter(true);
          }}
        >
          SEARCH
        </button>
      }
    </>
  );
}

function Pokedex() {
  const { pokemonForSearch } = useStore();

  const { data, isLoading, isError, isFetching, refetch } =
    useGetPokedexQuery();

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
      <SearchPokemon key="search" />
      <PokedexDiv>
        {pokedexData
          .filter((el) =>
            el.name.toLowerCase().includes(pokemonForSearch.toLowerCase())
          )
          .map((element) => {
            const arrayURL = element.url.split("/");
            return (
              <CardPokemonContainer
                key={"ContainerPokeID".concat(arrayURL[6])}
                url={element.url}
              />
            );
          })
          .sort((a, b) => a.id - b.id)}
      </PokedexDiv>
    </>
  );
}

const PokedexDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: stretch;
  justify-content: space-between;
  align-items: stretch;
`;

export default function ReduxPokedexApp() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <PokedexStoreProvider>
          <NavBar />
          <Routes>
            <Route path="/pokedex" element={<Pokedex key="pokedex" />} />
            <Route
              path="/pokedex/pokemon/:id"
              element={<PokemonInfoContainer key="pokeInfo" />}
            />
          </Routes>
        </PokedexStoreProvider>
      </BrowserRouter>
    </Provider>
  );
}
