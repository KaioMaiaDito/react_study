import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const PokedexStore = createContext();
const PokedexStoreProvider = ({ children }) => {
  const [pokedexData, setPokedexData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [pokemonForSearch, setPokemonForSearch] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  const loadPokedex = useCallback(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=" + 151) //151 pokemons da primeira geração
      .then((response) => response.json())
      .then((data) => {
        setPokedexData(data.results);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  const onTryAgainLoadPokedex = useCallback(() => {
    setIsLoading(true);
  }, []);

  const context = {
    loadPokedex,
    onTryAgainLoadPokedex,
    pokedexData,
    pokemonForSearch,
    setPokemonForSearch,
    isLoading,
    isError,
    isFilter,
    setIsLoading,
    setIsError,
    setIsFilter,
  };

  return (
    <PokedexStore.Provider value={context}>{children}</PokedexStore.Provider>
  );
};

function useStore() {
  return useContext(PokedexStore);
}

function CardPokemonContainer({ url }) {
  const [pokemon, setPokemon] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadPokemon = useCallback((pokemonUrl) => {
    fetch(pokemonUrl)
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      }); //Colocar um tryAgain
  }, []);

  useEffect(() => {
    if (isLoading) loadPokemon(url);
  }, [loadPokemon, isLoading, url]);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

  return pokemon.name ? (
    <CardPokemonComponent
      name={pokemon.name}
      image={pokemon.sprites.front_default}
      types={pokemon.types}
      id={pokemon.id}
      key={"pokeID".concat(pokemon.id)}
    />
  ) : null;
}

function CardPokemonComponent({ name, id, image, types }) {
  return (
    <div
      key={id}
      style={{
        margin: "8px",
        border: "1px solid",
        padding: "8px",
      }}
    >
      <img src={image} alt="imagem do pokemon" />
      <h3>{name}</h3>
      {types.map(({ type }) => (
        <h3>{type.name}</h3>
      ))}
    </div>
  );
}

function Pokedex() {
  const {
    loadPokedex,
    isLoading,
    isError,
    pokedexData,
    onTryAgainLoadPokedex,
    pokemonForSearch,
  } = useStore();

  useEffect(() => {
    if (isLoading) loadPokedex();
  }, [loadPokedex, isLoading]);

  if (isError)
    return (
      <>
        <h1>Error</h1>
        <button onClick={() => onTryAgainLoadPokedex()}>Try Again</button>
      </>
    );

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      <SearchPokemon key="search" />
      {pokedexData
        .filter((el) =>
          el.name.toLowerCase().includes(pokemonForSearch.toLowerCase())
        )
        .map((element, index) => {
          const arrayURL = element.url.split("/");
          return (
            <CardPokemonContainer
              key={"ContainerPokeID".concat(arrayURL[6])}
              url={element.url}
            />
          );
        })
        .sort((a, b) => a.id - b.id)}
    </>
  );
}

function SearchPokemon() {
  const {
    isLoading,
    isError,
    pokemonForSearch,
    setPokemonForSearch,
    setIsFilter,
  } = useStore();
  const changePokemonSearch = (event) => {
    event.preventDefault();
    setPokemonForSearch(event.target.value);
  };

  if (isLoading === false && isError === false)
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

export default function PokedexApp() {
  return (
    <PokedexStoreProvider>
      <Pokedex key="pokedex" />
    </PokedexStoreProvider>
  );
}
