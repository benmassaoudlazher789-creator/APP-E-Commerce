import {
    LOAD_ORDER,
    PLACE_ORDER_SUCCESS,
    GET_ORDER_SUCCESS,
    GET_ORDERS_SUCCESS,
    FAIL_ORDER,
} from "../actionsType/order.actionType";

const initialState = {
    isLoad: false,
    order: null,
    orders: [],
    errors: null,
};

const orderReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case LOAD_ORDER:
            return { ...state, isLoad: true };
        case PLACE_ORDER_SUCCESS:
        case GET_ORDER_SUCCESS:
            return { ...state, isLoad: false, order: payload, errors: null };
        case GET_ORDERS_SUCCESS:
            return { ...state, isLoad: false, orders: payload, errors: null };
        case FAIL_ORDER:
            return { ...state, isLoad: false, errors: payload };
        default:
            return state;
    }
};

export default orderReducer;
