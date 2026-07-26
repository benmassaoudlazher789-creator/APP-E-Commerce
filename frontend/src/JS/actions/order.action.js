import axios from "axios";
import {
    LOAD_ORDER,
    PLACE_ORDER_SUCCESS,
    GET_ORDER_SUCCESS,
    GET_ORDERS_SUCCESS,
    FAIL_ORDER,
} from "../actionsType/order.actionType";

const API_URL = "/api/order";

// place la commande cote backend (invite ou connecte : le token est envoye s'il existe)
export const placeOrder = (orderData) => async (dispatch) => {
    dispatch({ type: LOAD_ORDER });
    try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { authorization: token } } : {};
        const { data } = await axios.post(API_URL, orderData, config);
        dispatch({ type: PLACE_ORDER_SUCCESS, payload: data.order });
        return { success: true, order: data.order };
    } catch (error) {
        const msg = error.response?.data?.msg || "Failed to place order";
        dispatch({ type: FAIL_ORDER, payload: msg });
        return { success: false, error: msg };
    }
};

// recupere une commande via son numero (page de confirmation)
export const getOrderByNumber = (orderNumber) => async (dispatch) => {
    dispatch({ type: LOAD_ORDER });
    try {
        const { data } = await axios.get(`${API_URL}/${orderNumber}`);
        dispatch({ type: GET_ORDER_SUCCESS, payload: data.order });
    } catch (error) {
        dispatch({ type: FAIL_ORDER, payload: error.response?.data?.msg });
    }
};

// recupere les commandes de l'utilisateur connecte (page profil)
export const getMyOrders = () => async (dispatch) => {
    dispatch({ type: LOAD_ORDER });
    try {
        const config = { headers: { authorization: localStorage.getItem("token") } };
        const { data } = await axios.get(`${API_URL}/mine`, config);
        dispatch({ type: GET_ORDERS_SUCCESS, payload: data.orders });
    } catch (error) {
        dispatch({ type: FAIL_ORDER, payload: error.response?.data?.msg });
    }
};
