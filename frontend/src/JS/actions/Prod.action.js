// GET ALL PRODUCTS
export const getAllProducts = () => async (dispatch) => {
    try {
        const { data } = await axios.get(API_URL);
        dispatch({ type: GET_ALL_PRODUCTS, payload: data });
    } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
    }
};

// GET PRODUCT BY ID
export const getProductById = (id) => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        dispatch({ type: GET_PRODUCT_BY_ID, payload: data });
    } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
    }
};