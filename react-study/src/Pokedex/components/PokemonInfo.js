import { useParams } from "react-router-dom";
import { useGetPokemonByIdQuery } from "../api.js";

import { PokemonEvolutionsContainer } from "./PokemonEvolution.js";

import styled from "styled-components";
import open_pokeball from "./assets/open_pokeball.png";
import pokeball from "./assets/pokeball.gif";

function PokemonInfoContainer() {
  const linkParams = useParams();
  const pokemonId = linkParams.id;

  const {
    data: pokemonInfo,
    isError,
    isFetching,
  } = useGetPokemonByIdQuery(pokemonId);

  if (isFetching) return <h1>Loading...</h1>;
  if (isError) return <h1>Error</h1>;

  return (
    <>
      <PokemonInfoComponent
        name={pokemonInfo.name}
        image={pokemonInfo.sprites.front_default}
        types={pokemonInfo.types}
        id={pokemonInfo.id}
        infos={pokemonInfo}
        key={"pokeInfoCompID".concat(pokemonInfo.id)}
        isFetching={isFetching}
        isError={isError}
      />
      <PokemonEvolutionsContainer id={pokemonInfo.id} />
    </>
  );
}
function PokemonInfoComponent({
  name,
  id,
  image,
  types,
  infos,
  isFetching,
  isError,
}) {
  return (
    <>
      <PokemonInfoWrapper key={id}>
        <h2>{id}</h2>
        <PokemonImage
          src={isFetching ? pokeball : isError ? open_pokeball : image}
          alt="imagem do pokemon"
        />
        <PokemonName>{name}</PokemonName>
        <Divider />
        <InternPokeInfoWrapper>
          {types.map(({ type }) => (
            <h3 key={type.name}>{type.name}</h3>
          ))}
        </InternPokeInfoWrapper>
        <Divider />
        <InternPokeInfoWrapper>
          <h3>{"Altura: ".concat(infos.height).concat("dm")}</h3>
          <h3>{"Peso: ".concat(infos.weight).concat("hg")}</h3>
          <h3>{"Habilidade: ".concat(infos.abilities[0].ability.name)}</h3>
        </InternPokeInfoWrapper>
      </PokemonInfoWrapper>
    </>
  );
}

const PokemonImage = styled.img`
  border: 1px solid;
  margin: 8px;
  width: 120px;
`;

const PokemonInfoWrapper = styled.div`
  margin: 8px;
  border: 1px solid;
  padding: 0px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const InternPokeInfoWrapper = styled.div`
padding: 8px;
width: 28%;
display: flex;
flex-direction: column;
align-items: center;
}
`;
const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: black;
  margin: 0 10px;
  height: 14em;
`;
const PokemonName = styled.h3`
  font-size: large;
  padding: 24px;
`;

export { PokemonInfoComponent, PokemonInfoContainer };
