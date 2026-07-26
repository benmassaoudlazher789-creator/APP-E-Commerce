import {
    LOAD_WISHLIST,
    SET_WISHLIST,
    ADD_WISHLIST_ITEM,
    REMOVE_WISHLIST_ITEM,
    FAIL_WISHLIST,
} from "../actionsType/wishlist.actionType";

const initialState = {
    isLoad: false,
    items: [],
    errors: null,
};

const wishlistReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case LOAD_WISHLIST:
            return { ...state, isLoad: true };
        case SET_WISHLIST:
            return { ...state, isLoad: false, items: payload || [] };
        case ADD_WISHLIST_ITEM:
            return state.items.some((p) => p._id === payload._id)
                ? state
                : { ...state, items: [...state.items, payload] };
        case REMOVE_WISHLIST_ITEM:
            return { ...state, items: state.items.filter((p) => p._id !== payload) };
        case FAIL_WISHLIST:
            return { ...state, isLoad: false, errors: payload };
        default:
            return state;
    }
};

export default wishlistReducer;
