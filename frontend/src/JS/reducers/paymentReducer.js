import {
    PAYMENT_LOADING,
    PAYMENT_SUCCESS,
    PAYMENT_FAIL,
    PAYMENT_RESET,
} from "../actionsType/payment.actionType";

const initialState = {
    isLoad: false,
    transactionId: null,
    error: null,
};

const paymentReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case PAYMENT_LOADING:
            return { ...state, isLoad: true, error: null };
        case PAYMENT_SUCCESS:
            return { ...state, isLoad: false, transactionId: payload, error: null };
        case PAYMENT_FAIL:
            return { ...state, isLoad: false, error: payload };
        case PAYMENT_RESET:
            return initialState;
        default:
            return state;
    }
};

export default paymentReducer;
