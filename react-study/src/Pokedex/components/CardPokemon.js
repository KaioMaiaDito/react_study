import { Link } from "react-router-dom";
import styled from "styled-components";
import { useGetPokemonByUrlQuery } from "../api.js";
import open_pokeball from "./assets/open_pokeball.png";
import pokeball from "./assets/pokeball.gif";

function CardPokemonContainer({ url }) {
  const {
    data: pokemon,
    isLoading,
    isError,
    isFetching,
  } = useGetPokemonByUrlQuery(url);

  if (isLoading)
    return (
      <CardDiv>
        <h2>??</h2>
        <PokemonImage src={pokeball} alt="Imagem de loading pokemon" />

        <PokemonLoading>Loading...</PokemonLoading>
        <TypeDiv>
          <PokemonTypeLoading>Loading...</PokemonTypeLoading>
        </TypeDiv>
      </CardDiv>
    );
  if (isError)
    return (
      <CardDiv>
        <h2>??</h2>
        <PokemonImage src={open_pokeball} alt="Imagem de ERROR pokemon" />

        <PokemonLoading>ERROR</PokemonLoading>
        <TypeDiv>
          <PokemonTypeLoading>ERROR</PokemonTypeLoading>
        </TypeDiv>
      </CardDiv>
    );
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
    <>
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
      <CardDiv>
        <h2>??</h2>
        <PokemonImage src={pokeball} alt="Imagem de loading pokemon" />

        <PokemonLoading>Loading...</PokemonLoading>
        <TypeDiv>
          <h3>Loading...</h3>
          <h3>Loading...</h3>
        </TypeDiv>
      </CardDiv>
      <CardDiv>
        <h2>XX</h2>
        <PokemonImage src={open_pokeball} alt="Imagem de ERROR pokemon" />

        <PokemonLoading>ERROR</PokemonLoading>
        <TypeDiv>
          <h3>ERROR</h3>
          <h3>ERROR</h3>
        </TypeDiv>
      </CardDiv>
    </>
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
  width: 27em;
  justify-content: space-between;
`;

const TypeDiv = styled.div`
  border-left: 1px solid;
    padding: 16px;
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

const PokemonLoading = styled.p`
  font-size: large;
  color: black;
  text-decoration: none;
`;

const PokemonTypeLoading = styled.p`
  font-size: medium;
  color: black;
  text-decoration: none;
`;

export { CardPokemonComponent, CardPokemonContainer };
