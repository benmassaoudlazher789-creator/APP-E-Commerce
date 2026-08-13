import axios from "axios";
import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_QUANTITY,
    CLEAR_CART,
    SET_CART,
} from "../actionsType/cart.actionType";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1980';

// trouve le stock disponible pour une pointure donnée
const stockFor = (product, size) =>
    product.sizes?.find((s) => s.size === size)?.stock ?? 0;

// ajoute un produit au panier (incrémente la quantité si même produit + pointure)
export const addToCart = (product, size, quantity = 1) => (dispatch) => {
    const stock = stockFor(product, size);
    dispatch({
        type: ADD_TO_CART,
        payload: {
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.imageProd,
            brand: product.brand,
            size,
            quantity,
            stock,
        },
    });
};

export const removeFromCart = (productId, size) => ({
    type: REMOVE_FROM_CART,
    payload: { productId, size },
});

export const updateQuantity = (productId, size, quantity) => ({
    type: UPDATE_QUANTITY,
    payload: { productId, size, quantity },
});

export const clearCart = () => ({ type: CLEAR_CART });

// au login/register ou au refresh : charge le panier depuis MongoDB dans Redux
export const mergeServerCart = () => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get(`${API_URL}/api/cart`, { headers: { authorization: token } });
        dispatch({ type: SET_CART, payload: data.items || [] });
    } catch {
        // pas de panier serveur ou requete echouee
    }
};
