import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

//import Calculator from "./Calculator";
import ToDo from "./ToDo/ToDo";
//import Counter from "./Counter";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ToDo />
  </StrictMode>
);
