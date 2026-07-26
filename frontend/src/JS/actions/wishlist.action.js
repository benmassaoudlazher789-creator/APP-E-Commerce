import axios from "axios";
import {
    LOAD_WISHLIST,
    SET_WISHLIST,
    ADD_WISHLIST_ITEM,
    REMOVE_WISHLIST_ITEM,
    FAIL_WISHLIST,
} from "../actionsType/wishlist.actionType";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1980';

const authConfig = () => ({
    headers: { authorization: localStorage.getItem("token") },
});

// recupere la wishlist du user connecte (produits peuples, pas juste des ids)
export const getWishlist = () => async (dispatch) => {
    dispatch({ type: LOAD_WISHLIST });
    try {
        const { data } = await axios.get(`${API_URL}/api/auth/wishlist`, authConfig());
        dispatch({ type: SET_WISHLIST, payload: data.wishlist || [] });
    } catch (error) {
        dispatch({ type: FAIL_WISHLIST, payload: error.response?.data?.message });
    }
};

// ajoute un produit (deja disponible cote client, ex. depuis ProductCard) - mise a jour
// optimiste immediate, l'appel serveur suit derriere
export const addToWishlist = (product) => async (dispatch) => {
    dispatch({ type: ADD_WISHLIST_ITEM, payload: product });
    try {
        await axios.post(`${API_URL}/api/auth/wishlist/${product._id}`, {}, authConfig());
    } catch (error) {
        dispatch({ type: REMOVE_WISHLIST_ITEM, payload: product._id });
        dispatch({ type: FAIL_WISHLIST, payload: error.response?.data?.message });
    }
};

export const removeFromWishlist = (productId) => async (dispatch, getState) => {
    const previous = getState().wishlistReducer.items.find((p) => p._id === productId);
    dispatch({ type: REMOVE_WISHLIST_ITEM, payload: productId });
    try {
        await axios.delete(`${API_URL}/api/auth/wishlist/${productId}`, authConfig());
    } catch (error) {
        if (previous) dispatch({ type: ADD_WISHLIST_ITEM, payload: previous });
        dispatch({ type: FAIL_WISHLIST, payload: error.response?.data?.message });
    }
};
