import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

//import Calculator from "./Calculator";
//import ToDo from "./ToDo";
//import Counter from "./Counter";
import PokedexApp from "./Pokedex";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <PokedexApp />
  </StrictMode>
);
