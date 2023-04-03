import { useParams } from "react-router-dom";
import { useGetPokemonByNameQuery } from "../api.js";

import { PokemonEvolutionsContainer } from "./PokemonEvolution.js";

function PokemonInfoContainer() {
  const linkParams = useParams();
  const pokemonId = linkParams.id;

  const {
    data: pokemonInfo,
    isLoading,
    isError,
    isFetching,
  } = useGetPokemonByNameQuery(pokemonId);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;
  if (isFetching) return <></>;

  return pokemonInfo.name ? (
    <>
      <PokemonInfoComponent
        name={pokemonInfo.name}
        image={pokemonInfo.sprites.front_default}
        types={pokemonInfo.types}
        id={pokemonInfo.id}
        infos={pokemonInfo}
        key={"pokeInfoCompID".concat(pokemonInfo.id)}
      />
      <PokemonEvolutionsContainer id={pokemonInfo.id} />
    </>
  ) : null;
}
function PokemonInfoComponent({ name, id, image, types, infos }) {
  return (
    <>
      <div
        key={id}
        style={{
          margin: "8px",
          border: "1px solid",
          padding: "8px",
        }}
      >
        <img src={image} alt="imagem do pokemon" />
        <h2>{id}</h2>
        <h3>{name}</h3>
        {types.map(({ type }) => (
          <h3 key={type.name}>{type.name}</h3>
        ))}
        <h3>{"Altura: ".concat(infos.height).concat("dm")}</h3>
        <h3>{"Peso: ".concat(infos.weight).concat("hg")}</h3>
        <h3>{"Habilidade: ".concat(infos.abilities[0].ability.name)}</h3>
      </div>
    </>
  );
}

export { PokemonInfoComponent, PokemonInfoContainer };
