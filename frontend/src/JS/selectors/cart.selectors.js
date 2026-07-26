export const TAX_RATE = 0.07;
export const SHIPPING_COST = 12;
export const FREE_SHIPPING_THRESHOLD = 150;

export const selectCartItems = (state) => state.cartReducer.items;

export const selectCartCount = (state) =>
    state.cartReducer.items.reduce((count, item) => count + item.quantity, 0);

export const selectSubtotal = (state) =>
    state.cartReducer.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectTax = (state) => selectSubtotal(state) * TAX_RATE;

export const selectShipping = (state) => {
    const subtotal = selectSubtotal(state);
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return SHIPPING_COST;
};

export const selectTotal = (state) =>
    selectSubtotal(state) + selectTax(state) + selectShipping(state);
