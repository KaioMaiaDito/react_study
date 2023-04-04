import { Link } from "react-router-dom";
import styled from "styled-components";
import { useGetPokemonByIdQuery } from "../api.js";
import open_pokeball from "./assets/open_pokeball.png";
import pokeball from "./assets/pokeball.gif";

function CardPokemonContainer({ id }) {
  const { data: pokemon, isError, isFetching } = useGetPokemonByIdQuery(id);

  return (
    <CardPokemonComponent
      name={pokemon?.name}
      image={pokemon?.sprites.front_default}
      types={pokemon?.types}
      id={pokemon?.id}
      isFetching={isFetching}
      isError={isError}
    />
  );
}

function CardPokemonComponent({ name, id, image, types, isFetching, isError }) {
  const LinkPokemon = isFetching
    ? PokemonLoading
    : isError
    ? PokemonLoading
    : PokemonLink;
  return (
    <>
      <CardWrapper>
        <h2>{id ?? "??"}</h2>
        <PokemonImage
          src={isFetching ? pokeball : isError ? open_pokeball : image}
          alt="imagem do pokemon"
        />

        <LinkPokemon to={"/pokedex/pokemon/".concat(id)}>
          {isFetching ? "Loading..." : isError ? "Error" : name}
        </LinkPokemon>
        <TypeWrapper>
          {types &&
            types.map(({ type }) => <h3 key={type.name}>{type.name}</h3>)}
        </TypeWrapper>
      </CardWrapper>
    </>
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
  justify-content: space-between;
`;

const TypeWrapper = styled.div`
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

export { CardPokemonComponent, CardPokemonContainer };
