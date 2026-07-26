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

const initialState = {
    isLoad: false,
    products: [],
    product: null,
    myProducts: [],
    errors: null,
};

const productReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case LOAD_PROD:
            return { ...state, isLoad: true };
        case GET_PRODUCTS:
            return { ...state, isLoad: false, products: payload || [] };
        case GET_ONE_PRODUCT:
            return { ...state, isLoad: false, product: payload || null };
        case GET_MY_PRODUCT:
            return { ...state, isLoad: false, myProducts: payload || [] };
        case ADD_PRODUCT:
            return { ...state, isLoad: false, myProducts: [...state.myProducts, payload] };
        case EDIT_PRODUCT:
            return {
                ...state,
                isLoad: false,
                myProducts: state.myProducts.map((p) => (p._id === payload._id ? payload : p)),
                product: state.product?._id === payload._id ? payload : state.product,
            };
        case DELETE_PRODUCT:
            return {
                ...state,
                isLoad: false,
                myProducts: state.myProducts.filter((p) => p._id !== payload),
            };
        case FAIL_PROD:
            return { ...state, isLoad: false, errors: payload };
        default:
            return state;
    }
};

export default productReducer;
