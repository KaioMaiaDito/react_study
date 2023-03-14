import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";

//usar o AbortController na requisição do fetch da API pra caso tenha outras requisições ele aborte a anterior

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
      <h2>{id}</h2>
      <img src={image} alt="imagem do pokemon" />
      <Link to={"/pokedex/pokemon/".concat(id)}>{name}</Link>
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

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/pokedex">Pokedex</Link>
        </li>
      </ul>
    </nav>
  );
}

function PokemonInfoContainer() {
  const [pokemonInfo, setPokemonInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const linkParams = useParams();
  const pokemonId = linkParams.id;

  const loadPokemonInfo = useCallback((pokeID) => {
    fetch("https://pokeapi.co/api/v2/pokemon/".concat(pokeID))
      .then((response) => response.json())
      .then((data) => {
        setPokemonInfo(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    if (isLoading) {
      loadPokemonInfo(pokemonId);
    }
  }, [loadPokemonInfo, isLoading, pokemonId]);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;
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
          <h3>{type.name}</h3>
        ))}
        <h3>{"Altura: ".concat(infos.height).concat("dm")}</h3>
        <h3>{"Peso: ".concat(infos.weight).concat("hg")}</h3>
        <h3>{"Habilidade: ".concat(infos.abilities[0].ability.name)}</h3>
      </div>
    </>
  );
}
function PokemonEvolutionsContainer({ id }) {
  const [pokemonSpecies, setPokemonSpecies] = useState(undefined);
  const [pokemonEvolChain, setPokemonEvolChain] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadPokemonSpecies = useCallback((pokeID) => {
    fetch("https://pokeapi.co/api/v2/pokemon-species/".concat(pokeID))
      .then((response) => response.json())
      .then((data) => {
        setPokemonSpecies(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  const loadPokemonEvolChain = useCallback((url) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPokemonEvolChain(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    if (isLoading) {
      loadPokemonSpecies(id);
    }
  }, [loadPokemonSpecies, isLoading, id]);

  useEffect(() => {
    if (pokemonSpecies) {
      loadPokemonEvolChain(pokemonSpecies.evolution_chain.url);
    }
  }, [loadPokemonEvolChain, pokemonSpecies]);

  function findEvolutions(objectEvolve, currentPokeName) {
    if (objectEvolve.species.name === currentPokeName) {
      if (objectEvolve.evolves_to.length !== 0) {
        return objectEvolve.evolves_to.map((element) => {
          return element.species.name;
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

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

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
  const [pokemon, setPokemon] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadPokemon = useCallback((pokeID) => {
    fetch("https://pokeapi.co/api/v2/pokemon/".concat(pokeID))
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
    if (isLoading) {
      loadPokemon(id);
    }
  }, [loadPokemon, isLoading, id]);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

  return pokemon.id <= 151 ? (
    <div
      key={"PokeEvolution".concat(pokemon.id)}
      style={{
        margin: "8px",
        border: "1px solid",
        padding: "8px",
      }}
    >
      <img src={pokemon.sprites.front_default} alt="imagem do pokemon" />
      <Link reloadDocument to={"/pokedex/pokemon/".concat(pokemon.id)}>
        {"ID#".concat(pokemon.id).concat(" ").concat(pokemon.name)}
      </Link>
    </div>
  ) : (
    <></>
  );
}

export default function PokedexApp() {
  return (
    <BrowserRouter>
      <PokedexStoreProvider>
        <NavBar />
        <Routes>
          <Route path="/pokedex" element={<Pokedex key="pokedex" />} />
          <Route
            path="/pokedex/pokemon/:id"
            element={<PokemonInfoContainer key="pokeInfo" />}
          />
        </Routes>
      </PokedexStoreProvider>
    </BrowserRouter>
  );
}
