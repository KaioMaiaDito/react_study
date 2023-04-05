import { useState } from "react";
import { useGetPokemonByIdQuery } from "../api.js";

import styled from "styled-components";
import guess from "./assets/guess.jpeg";
import open_pokeball from "./assets/open_pokeball.png";
import pokeball from "./assets/pokeball.gif";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

let pokemonId = getRandomInt(1, 151);
let guessMessage;

export function RandomPokemon() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonGuessed, setPokemonGuessed] = useState(false);

  const {
    data: pokemon,
    isError,
    isFetching,
    refetch,
  } = useGetPokemonByIdQuery(pokemonId);

  const handleChange = (event) => {
    event.preventDefault();
    setPokemonName(event.target.value);
    console.log(event.target.value);
  };

  const handleClick = () => {
    setPokemonGuessed(true);
    console.log(pokemonName.toLowerCase(), pokemon.name.toLowerCase());
    console.log(pokemonName.toLowerCase() === pokemon.name.toLowerCase());
    if (pokemonName.toLowerCase() === pokemon.name.toLowerCase()) {
      guessMessage = "Parabens você acertou, é o";
      return;
    }
    guessMessage = "Você errou, é o";
  };

  const ShowPokemon = () => {
    setPokemonGuessed(true);
  };
  const generateOtherPokemon = () => {
    pokemonId = getRandomInt(1, 151);
    refetch();
    setPokemonGuessed(false);
    setPokemonName("");
  };

  const PokemonImage =
    pokemonGuessed || isFetching || isError ? PokemonGuessed : PokemonToGuess;
  return (
    <Centralize>
      <GuessWrapper img={guess}>
        <PokemonImage
          src={
            isFetching
              ? pokeball
              : isError
              ? open_pokeball
              : pokemon?.sprites.front_default
          }
          alt="Imagem do pokemon a adivinhar"
        />
        {pokemonGuessed ? (
          <Message>{guessMessage + ": " + pokemon.name}</Message>
        ) : (
          <></>
        )}
      </GuessWrapper>
      <input
        name="pokemonSearch"
        type="text"
        placeholder="Digite o nome do pokemon"
        value={pokemonName}
        onChange={handleChange}
      />
      <button disabled={pokemonGuessed} onClick={handleClick}>
        Guess
      </button>
      <button disabled={pokemonGuessed} onClick={() => ShowPokemon()}>
        Show
      </button>
      <button onClick={() => generateOtherPokemon()}>Generate Other</button>
    </Centralize>
  );
}

const GuessWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 70vw;
  height: 70vh;
  background-size: 90%;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.img});
`;

const PokemonToGuess = styled.img`
  filter: brightness(0%);
  position: absolute;
  left: 20%;
  top: 11%;
  width: 30vw;
`;

const PokemonGuessed = styled.img`
  position: absolute;
  left: 20%;
  top: 11%;
  width: 30vw;
`;

const Centralize = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Message = styled.h3`
  position: absolute;
  left: 20%;
  top: 70%;
`;
