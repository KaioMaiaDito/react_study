import { useParams } from "react-router-dom";
import { useGetPokemonByNameQuery } from "../api.js";

import { PokemonEvolutionsContainer } from "./PokemonEvolution.js";

import styled from "styled-components";


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
      <PokemonInfoDiv
        key={id}
      >
        <h2>{id}</h2>
        <PokemonImage src={image} alt="imagem do pokemon" />
        <PokemonName>{name}</PokemonName>
        <Divider/>
        <InternPokeInfoDiv>
          {types.map(({ type }) => (
            <h3 key={type.name}>{type.name}</h3>
          ))}
        </InternPokeInfoDiv>
        <Divider/>
        <InternPokeInfoDiv>
          <h3>{"Altura: ".concat(infos.height).concat("dm")}</h3>
          <h3>{"Peso: ".concat(infos.weight).concat("hg")}</h3>
          <h3>{"Habilidade: ".concat(infos.abilities[0].ability.name)}</h3>
        </InternPokeInfoDiv>
      </PokemonInfoDiv>
    </>
  );
}

const PokemonImage = styled.img`
  border: 1px solid;
  margin: 8px;
  width: 120px;
`;

const PokemonInfoDiv = styled.div`
margin: 8px;
border: 1px solid;
padding: 0px 16px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-evenly;
`

const InternPokeInfoDiv =  styled.div`
padding: 8px;
width: 28%;
display: flex;
flex-direction: column;
align-items: center;
}
`
const Divider = styled.div`
display: inline-block;
  width: 1px;
  background-color: black;
  margin: 0 10px;
  height: 14em;

`
const PokemonName = styled.h3`
    font-size: large;
    padding: 24px;
`

export { PokemonInfoComponent, PokemonInfoContainer };
