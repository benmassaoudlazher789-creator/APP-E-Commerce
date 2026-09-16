import axios from "axios";
import { LOAD_CART, SET_CART, FAIL_CART, CLEAR_CART } from "../actionsType/cart.actionType";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1980';

const authConfig = () => ({
    headers: { authorization: localStorage.getItem("token") },
});

// seule source de verite du panier cote frontend : le state Redux est toujours rempli a
// partir de la reponse serveur (jamais calcule localement), pour que la navbar, la page
// /cart et le checkout affichent toujours exactement le meme panier
export const getCart = () => async (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
        dispatch({ type: SET_CART, payload: [] });
        return { success: true, items: [] };
    }
    dispatch({ type: LOAD_CART });
    try {
        const { data } = await axios.get(`${API_URL}/api/cart`, authConfig());
        const items = data.items || [];
        dispatch({ type: SET_CART, payload: items });
        return { success: true, items };
    } catch (error) {
        const msg = error.response?.data?.msg || "Failed to load cart";
        dispatch({ type: FAIL_CART, payload: msg });
        return { success: false, error: msg };
    }
};

// conserve pour compatibilite avec auth.action.js (appele au login/register/current)
export const mergeServerCart = () => getCart();

// ajoute un produit (ou incremente sa quantite s'il est deja dans le panier) - persiste
// cote serveur (source de verite) puis recharge le panier complet, pour recuperer le stock
// et le totalPrice recalcules par le backend
export const addToCart = (product, size, quantity = 1) => async (dispatch, getState) => {
    if (!getState().authReducer.isAuth) {
        return { success: false, error: "Please sign in to add items to your cart." };
    }
    try {
        await axios.post(
            `${API_URL}/api/cart/add`,
            { productId: product._id, quantity, size },
            authConfig()
        );
        return dispatch(getCart());
    } catch (error) {
        const msg = error.response?.data?.msg || "Failed to add to cart";
        dispatch({ type: FAIL_CART, payload: msg });
        return { success: false, error: msg };
    }
};

// ajuste la quantite d'un article deja dans le panier (delta relatif : +1/-1 depuis les
// boutons de la page panier) en reutilisant /api/cart/add, qui incremente/decremente
export const updateCartQuantity = (productId, size, delta) => async (dispatch, getState) => {
    if (!getState().authReducer.isAuth) {
        return { success: false, error: "Please sign in to update your cart." };
    }
    try {
        await axios.post(
            `${API_URL}/api/cart/add`,
            { productId, quantity: delta, size },
            authConfig()
        );
        return dispatch(getCart());
    } catch (error) {
        const msg = error.response?.data?.msg || "Failed to update quantity";
        dispatch({ type: FAIL_CART, payload: msg });
        return { success: false, error: msg };
    }
};

// retire completement un article du panier (toutes quantites confondues)
export const removeFromCart = (productId, size) => async (dispatch, getState) => {
    if (!getState().authReducer.isAuth) {
        return { success: false, error: "Please sign in to update your cart." };
    }
    try {
        const sizeQuery = size != null ? `?size=${size}` : "";
        await axios.delete(`${API_URL}/api/cart/remove/${productId}${sizeQuery}`, authConfig());
        return dispatch(getCart());
    } catch (error) {
        const msg = error.response?.data?.msg || "Failed to remove item";
        dispatch({ type: FAIL_CART, payload: msg });
        return { success: false, error: msg };
    }
};

// vide le panier (fin de commande) - persiste cote serveur avant de vider Redux
export const clearCart = () => async (dispatch, getState) => {
    if (getState().authReducer.isAuth) {
        try {
            await axios.delete(`${API_URL}/api/cart`, authConfig());
        } catch (error) {
            // le panier local est quand meme vide (commande deja passee) : ne bloque pas
            // l'utilisateur sur une erreur de nettoyage post-paiement
            console.error("Erreur:", error.response?.data || error.message);
        }
    }
    dispatch({ type: CLEAR_CART });
};
