import { Link } from "react-router-dom";

import {
  useGetPokemonByNameQuery,
  useGetPokemonEvolutionChainQuery,
  useGetPokemonSpeciesQuery,
} from "../api.js";

function PokemonEvolutionsContainer({ id }) {
  const {
    data: pokemonSpecies,
    isLoading: isLoadingSpecies,
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

  if (isLoadingSpecies) return <h1>Loading</h1>;
  if (isErrorSpecies) return <h1>Error</h1>;
  if (isFetchingSpecies) return <></>;

  const evolutionNames =
    pokemonEvolChain !== undefined
      ? findEvolutions(pokemonEvolChain?.chain, pokemonSpecies.name)
      : [];

  const idFromSpecies =
    pokemonSpecies.evolves_from_species !== null
      ? pokemonSpecies.evolves_from_species.url.split("/")
      : null;

  return (
    <>
      <h1>Evoluiu de:</h1>
      {pokemonSpecies.evolves_from_species !== null &&
      idFromSpecies[6] <= 151 ? (
        <PokemonEvolutionsComponent
          id={pokemonSpecies.evolves_from_species.name}
          key={"pokeEvolutionID".concat(
            pokemonSpecies.evolves_from_species.name
          )}
        />
      ) : (
        <h2>Não possui Evolução</h2>
      )}
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
    </>
  );
}

function PokemonEvolutionsComponent({ id }) {
  const {
    data: pokemon,
    isLoading,
    isError,
    isFetching,
  } = useGetPokemonByNameQuery(id);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;
  if (isFetching) return <></>;

  return pokemon.id <= 151 ? (
    <div
      key={"PokeEvolution".concat(pokemon.id)}
      style={{
        margin: "8px",
        border: "1px solid",
        padding: "8px",
      }}
    >
      <p>{id}</p>
      <img src={pokemon.sprites.front_default} alt="imagem do pokemon" />
      <Link to={"/pokedex/pokemon/".concat(pokemon.id)}>
        {"ID#".concat(pokemon.id).concat(" ").concat(pokemon.name)}
      </Link>
    </div>
  ) : (
    <></>
  );
}

export { PokemonEvolutionsComponent, PokemonEvolutionsContainer };
