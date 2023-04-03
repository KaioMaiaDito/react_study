import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { pokemonApi } from "./api";

const rootReducer = combineReducers({
  // Adicione aqui os demais reducers da aplicação
  [pokemonApi.reducerPath]: pokemonApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { warnAfter: 100 } }).concat(
      pokemonApi.middleware
    ),
  devTools: true,
});

export default store;
