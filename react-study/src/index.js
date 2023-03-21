import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// import Counter from "./Counter";
// import Calculator from "./Calculator";
// import ToDo from "./ToDo";
import ToDoObject from "./ToDoObject";
//import PokedexApp from "./Pokedex";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    {/* {<Counter />} */}
    {/* {<Calculator />} */}
    {/* {<ToDo />} */}
    {<ToDoObject />}
    {/* {<PokedexApp />} */}
  </StrictMode>
);
