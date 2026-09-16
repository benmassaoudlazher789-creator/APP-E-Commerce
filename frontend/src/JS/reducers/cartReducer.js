import { LOAD_CART, SET_CART, FAIL_CART, CLEAR_CART } from "../actionsType/cart.actionType";

// isLoad demarre a true (pas false) : le panier est charge des le montage de l'app
// (voir mergeServerCart dans auth.action.js) - evite un flash "panier vide" avant que
// le premier chargement ait eu le temps d'aboutir
const initialState = {
    isLoad: true,
    items: [], // { productId, title, price, image, brand, size, quantity, stock }
    errors: null,
};

const cartReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case LOAD_CART:
            return { ...state, isLoad: true };
        case SET_CART:
            return { ...state, isLoad: false, items: payload || [], errors: null };
        case FAIL_CART:
            return { ...state, isLoad: false, errors: payload };
        case CLEAR_CART:
            return { ...state, items: [] };
        default:
            return state;
    }
};

export default cartReducer;
