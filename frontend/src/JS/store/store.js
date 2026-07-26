import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import axios from "axios";
import rootReducer from "../reducers/index";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1980';

const CART_STORAGE_KEY = "cart";

// rehydratation du panier depuis le localStorage au chargement
const loadCartFromStorage = () => {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? { items: JSON.parse(saved) } : undefined;
    } catch {
        return undefined;
    }
};

const preloadedCart = loadCartFromStorage();
const preloadedState = preloadedCart ? { cartReducer: preloadedCart } : undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk))
);

// persiste le panier a chaque changement d'etat (localStorage pour les invites,
// + panier serveur en plus si un utilisateur est connecte, pour la synchro multi-appareil)
let previousItems = store.getState().cartReducer.items;
store.subscribe(() => {
    const currentItems = store.getState().cartReducer.items;
    if (currentItems !== previousItems) {
        previousItems = currentItems;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));

        const token = localStorage.getItem("token");
        if (token) {
            axios
                .put(`${API_URL}/api/cart`, { items: currentItems }, { headers: { authorization: token } })
                .catch(() => {
                    // echec silencieux : le panier reste correct en local/localStorage
                });
        }
    }
});

export default store;
