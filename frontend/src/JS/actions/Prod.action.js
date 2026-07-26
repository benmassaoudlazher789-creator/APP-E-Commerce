import axios from "axios";
import {
    LOAD_PROD,
    GET_PRODUCTS,
    GET_ONE_PRODUCT,
    GET_MY_PRODUCT,
    ADD_PRODUCT,
    EDIT_PRODUCT,
    DELETE_PRODUCT,
    FAIL_PROD,
} from "../actionsType/Prod.actionType";

export const API_URL = "/api/product";

// header d'authentification (token brut, sans préfixe Bearer)
const authConfig = () => ({
    headers: { authorization: localStorage.getItem("token") },
});

// GET ALL PRODUCTS (filtres optionnels : { gender, category })
export const getAllProducts = (filters = {}) => async (dispatch) => {
    dispatch({ type: LOAD_PROD });
    try {
        const params = new URLSearchParams(
            Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
        );
        const query = params.toString();
        const { data } = await axios.get(`${API_URL}/allProd${query ? `?${query}` : ""}`);
        dispatch({ type: GET_PRODUCTS, payload: data.Prod });
    } catch (error) {
        dispatch({ type: FAIL_PROD, payload: error.response?.data?.msg });
        console.error("Erreur:", error.response?.data || error.message);
    }
};

// SEARCH PRODUCTS (titre/description/categorie/marque) - meme forme de payload que
// getAllProducts, reutilise donc le meme type d'action (productReducer n'a rien a savoir
// de plus)
export const searchProducts = (q) => async (dispatch) => {
    dispatch({ type: LOAD_PROD });
    try {
        const { data } = await axios.get(`${API_URL}/search`, { params: { q } });
        dispatch({ type: GET_PRODUCTS, payload: data.Prod });
    } catch (error) {
        dispatch({ type: FAIL_PROD, payload: error.response?.data?.msg });
        console.error("Erreur:", error.response?.data || error.message);
    }
};

// GET PRODUCT BY ID
export const getProductById = (id) => async (dispatch) => {
    dispatch({ type: LOAD_PROD });
    try {
        const { data } = await axios.get(`${API_URL}/prod/${id}`);
        dispatch({ type: GET_ONE_PRODUCT, payload: data.prodToGet });
    } catch (error) {
        dispatch({ type: FAIL_PROD, payload: error.response?.data?.msg });
        console.error("Erreur:", error.response?.data || error.message);
    }
};

// GET MY PRODUCTS (produits créés par l'utilisateur connecté)
export const getMyProducts = () => async (dispatch) => {
    dispatch({ type: LOAD_PROD });
    try {
        const { data } = await axios.get(`${API_URL}/myProd`, authConfig());
        dispatch({ type: GET_MY_PRODUCT, payload: data.myListProd });
    } catch (error) {
        dispatch({ type: FAIL_PROD, payload: error.response?.data?.msg });
        console.error("Erreur:", error.response?.data || error.message);
    }
};

// ADD PRODUCT (newProduct peut etre un objet JSON ou un FormData si des images sont jointes)
export const addProduct = (newProduct) => async (dispatch) => {
    dispatch({ type: LOAD_PROD });
    try {
        const { data } = await axios.post(`${API_URL}/addProd`, newProduct, authConfig());
        dispatch({ type: ADD_PRODUCT, payload: data.newProd });
        return { success: true, product: data.newProd };
    } catch (error) {
        const msg = error.response?.data?.msg || "Failed to add product";
        dispatch({ type: FAIL_PROD, payload: msg });
        console.error("Erreur:", error.response?.data || error.message);
        return { success: false, error: msg };
    }
};

// EDIT PRODUCT
export const editProduct = (id, updatedProduct) => async (dispatch) => {
    dispatch({ type: LOAD_PROD });
    try {
        const { data } = await axios.put(`${API_URL}/${id}`, updatedProduct, authConfig());
        dispatch({ type: EDIT_PRODUCT, payload: data.prodToUpdate });
    } catch (error) {
        dispatch({ type: FAIL_PROD, payload: error.response?.data?.msg });
        console.error("Erreur:", error.response?.data || error.message);
    }
};

// DELETE PRODUCT
export const deleteProduct = (id) => async (dispatch) => {
    dispatch({ type: LOAD_PROD });
    try {
        await axios.delete(`${API_URL}/${id}`, authConfig());
        dispatch({ type: DELETE_PRODUCT, payload: id });
    } catch (error) {
        dispatch({ type: FAIL_PROD, payload: error.response?.data?.msg });
        console.error("Erreur:", error.response?.data || error.message);
    }
};
