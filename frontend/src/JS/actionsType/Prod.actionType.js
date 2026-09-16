//chargement
export const LOAD_PROD = "LOAD_PROD";
//success
export const GET_PRODUCTS = "GET_PRODUCTS";
export const GET_ONE_PRODUCT = "GET_ONE_PRODUCT";
export const GET_MY_PRODUCT = "GET_MY_PRODUCT";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

//FAIL
export const FAIL_PROD = "FAIL_PROD";

//new arrivals (home page) : etat separe de `products`/`isLoad` ci-dessus, qui est
//deja consomme par ProductDetail pour les "related products" - reutiliser GET_PRODUCTS
//ici ecraserait ce state avec une liste limitee/triee et casserait cette page.
export const LOAD_NEW_ARRIVALS = "LOAD_NEW_ARRIVALS";
export const GET_NEW_ARRIVALS = "GET_NEW_ARRIVALS";
export const FAIL_NEW_ARRIVALS = "FAIL_NEW_ARRIVALS";

//sale products (page /sale) : meme raisonnement que New Arrivals ci-dessus,
//etat dedie pour ne pas ecraser `products`/`newArrivals`.
export const LOAD_SALE_PRODUCTS = "LOAD_SALE_PRODUCTS";
export const GET_SALE_PRODUCTS = "GET_SALE_PRODUCTS";
export const FAIL_SALE_PRODUCTS = "FAIL_SALE_PRODUCTS";
