import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";
import rootReducer from "../reducers/index";

// DevTools actives uniquement en dev : import.meta.env.DEV est le flag natif
// Vite (true avec `vite`/`vite dev`, false dans le build de prod), pour ne
// jamais exposer le state Redux a un visiteur du site en ligne.
const composeEnhancers = import.meta.env.DEV ? composeWithDevTools : compose;

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;
