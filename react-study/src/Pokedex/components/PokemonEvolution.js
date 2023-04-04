import { Link } from "react-router-dom";

import {
  useGetPokemonByIdQuery,
  useGetPokemonEvolutionChainQuery,
  useGetPokemonSpeciesQuery,
} from "../api.js";

import styled from "styled-components";
import open_pokeball from "./assets/open_pokeball.png";
import pokeball from "./assets/pokeball.gif";

function PokemonEvolutionsContainer({ id }) {
  const {
    data: pokemonSpecies,
    isError: isErrorSpecies,
    isFetching: isFetchingSpecies,
    isSuccess: isSuccessSpecies,
  } = useGetPokemonSpeciesQuery(id);

  const evolutionUrl = pokemonSpecies
    ? pokemonSpecies.evolution_chain.url
    : null;

  const { data: pokemonEvolChain } = useGetPokemonEvolutionChainQuery(
    evolutionUrl?.split("/")[6],
    { skip: !isSuccessSpecies }
  );

  function findEvolutions(objectEvolve, currentPokeName) {
    if (objectEvolve.species.name === currentPokeName) {
      if (objectEvolve.evolves_to.length !== 0) {
        return objectEvolve.evolves_to.map((element) => {
          return element.species.url.split("/")[6];
        });
      }
      return [];
    }

    return objectEvolve.evolves_to.reduce((acc, current) => {
      if (current !== undefined) {
        return findEvolutions(current, currentPokeName);
      }
      return acc ?? [];
    }, []);
  }

  if (isFetchingSpecies) return <h1>Loading</h1>;
  if (isErrorSpecies) return <h1>Error</h1>;

  const evolutionNames =
    pokemonEvolChain !== undefined
      ? findEvolutions(pokemonEvolChain?.chain, pokemonSpecies.name)
      : [];

  const idFromSpecies =
    pokemonSpecies?.evolves_from_species !== null
      ? pokemonSpecies?.evolves_from_species.url.split("/")[6]
      : null;

  return (
    <EvolutionsWrapper>
      <EvolutionWrapper>
        <h1>Evoluiu de:</h1>
        {pokemonSpecies?.evolves_from_species !== null &&
        idFromSpecies <= 151 ? (
          <PokemonEvolutionsComponent id={idFromSpecies} />
        ) : (
          <h2>Não possui Evolução</h2>
        )}
      </EvolutionWrapper>
      <EvolutionWrapper>
        <h1>Evolui para:</h1>
        {pokemonEvolChain?.chain.evolves_to.length !== 0 &&
        evolutionNames.length !== 0 ? (
          evolutionNames.map((element) => (
            <PokemonEvolutionsComponent
              id={element}
              key={"pokeEvolutionID".concat(element)}
            />
          ))
        ) : (
          <h2>Não possui Evolução</h2>
        )}
      </EvolutionWrapper>
    </EvolutionsWrapper>
  );
}

const EvolutionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
`;

const EvolutionsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
`;

function PokemonEvolutionsComponent({ id }) {
  const { data: pokemon, isError, isFetching } = useGetPokemonByIdQuery(id);

  return pokemon?.id <= 151 ? (
    <CardWrapper key={"PokeEvolution".concat(pokemon.id)}>
      <h2>{isFetching ? "??" : isError ? "??" : pokemon.id}</h2>
      <PokemonImage
        src={
          isFetching
            ? pokeball
            : isError
            ? open_pokeball
            : pokemon.sprites.front_default
        }
        alt="Imagem do pokemon"
      />
      <PokemonLink to={"/pokedex/pokemon/".concat(pokemon.id)}>
        {isFetching ? "Loading..." : isError ? "Error" : pokemon.name}
      </PokemonLink>
    </CardWrapper>
  ) : (
    <></>
  );
}

const CardWrapper = styled.div`
  margin: 8px;
  border: 1px solid;
  padding: 8px;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  width: 27em;
  -webkit-box-pack: justify;
  justify-content: space-evenly;
`;

const PokemonImage = styled.img`
  border: 1px solid;
  margin: 8px;
  width: 120px;
`;

const PokemonLink = styled(Link)`
  font-size: large;
  color: black;
  text-decoration: none;
`;

export { PokemonEvolutionsComponent, PokemonEvolutionsContainer };
