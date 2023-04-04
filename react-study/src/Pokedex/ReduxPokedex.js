import { Provider } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Pokedex } from "./components/Pokedex.js";
import { PokemonInfoContainer } from "./components/PokemonInfo.js";
import store from "./store.js";

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

export default function ReduxPokedexApp() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/pokedex" element={<Pokedex key="pokedex" />} />
          <Route
            path="/pokedex/pokemon/:id"
            element={<PokemonInfoContainer key="pokeInfo" />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
