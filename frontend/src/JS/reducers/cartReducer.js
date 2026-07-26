import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_QUANTITY,
    CLEAR_CART,
    SET_CART,
} from "../actionsType/cart.actionType";

const initialState = {
    items: [], // { productId, title, price, image, brand, size, quantity, stock }
};

const clamp = (quantity, stock) => Math.max(1, Math.min(quantity, stock || 1));

const cartReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case ADD_TO_CART: {
            const { productId, size } = payload;
            const existing = state.items.find(
                (item) => item.productId === productId && item.size === size
            );
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item === existing
                            ? { ...item, quantity: clamp(item.quantity + payload.quantity, item.stock) }
                            : item
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, { ...payload, quantity: clamp(payload.quantity, payload.stock) }],
            };
        }
        case REMOVE_FROM_CART:
            return {
                ...state,
                items: state.items.filter(
                    (item) => !(item.productId === payload.productId && item.size === payload.size)
                ),
            };
        case UPDATE_QUANTITY:
            return {
                ...state,
                items: state.items.map((item) =>
                    item.productId === payload.productId && item.size === payload.size
                        ? { ...item, quantity: clamp(payload.quantity, item.stock) }
                        : item
                ),
            };
        case CLEAR_CART:
            return { ...state, items: [] };
        case SET_CART:
            return { ...state, items: payload };
        default:
            return state;
    }
};

export default cartReducer;
