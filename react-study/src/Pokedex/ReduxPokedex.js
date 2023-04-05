import { Provider } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Pokedex } from "./components/Pokedex.js";
import { PokemonInfoContainer } from "./components/PokemonInfo.js";
import { RandomPokemon } from "./components/RandomPokemon.js";
import store from "./store.js";

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/pokedex">Pokedex</Link>
        </li>
        <li>
          <Link to="/random-pokemon">Surprise</Link>
        </li>
      </ul>
    </nav>
  );
}

export default function ReduxPokedexApp() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/pokedex" element={<Pokedex />} />
          <Route
            path="/pokedex/pokemon/:id"
            element={<PokemonInfoContainer />}
          />
          <Route path="/random-pokemon" element={<RandomPokemon />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
