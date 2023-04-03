import { Link } from "react-router-dom";
import { useGetPokemonByUrlQuery } from "../api.js";

import styled from "styled-components";

function CardPokemonContainer({ url }) {
  const {
    data: pokemon,
    isLoading,
    isError,
    isFetching,
  } = useGetPokemonByUrlQuery(url);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;
  if (isFetching) return <></>;

  return pokemon.name ? (
    <CardPokemonComponent
      name={pokemon.name}
      image={pokemon.sprites.front_default}
      types={pokemon.types}
      id={pokemon.id}
      key={pokemon.id}
    />
  ) : null;
}

function CardPokemonComponent({ name, id, image, types }) {
  return (
    <CardDiv>
      <h2>{id}</h2>
      <PokemonImage src={image} alt="imagem do pokemon" />

      <PokemonLink to={"/pokedex/pokemon/".concat(id)}>{name}</PokemonLink>
      <TypeDiv>
        {types.map(({ type }) => (
          <h3 key={type.name}>{type.name}</h3>
        ))}
      </TypeDiv>
    </CardDiv>
  );
}

const CardDiv = styled.div`
  margin: 8px;
  border: 1px solid;
  padding: 8px;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  width: 400px;
  justify-content: space-between;
`;

const TypeDiv = styled.div`
  border-left: 1px solid;
    padding: 8px;
    margin: 8px;
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
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

export { CardPokemonComponent, CardPokemonContainer };
