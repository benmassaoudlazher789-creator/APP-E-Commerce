import { LOAD_AUTH, SUCCESS_AUTH, FAIL_AUTH, CURRENT_AUTH, LOGOUT_AUTH, UPDATE_USER_SUCCESS } from "../actionsType/auth.actionType";
import axios from "axios";
import { mergeServerCart } from "./cart.action";
import { getWishlist } from "./wishlist.action";

// Le backend ne renvoie pas un format d'erreur unique : la validation
// (express-validator) renvoie { errors: [{msg, path, ...}] }, alors que les
// erreurs "métier" (email deja utilise, etc.) renvoient { message }. Aucune
// des deux routes ne renvoie jamais { msg } au niveau racine, donc lire
// error.response.data.msg directement renvoie toujours undefined.
const extractAuthError = (error) => {
    const data = error.response?.data;
    if (data?.errors?.length) return data.errors.map((e) => e.msg).join(" ");
    if (data?.message) return data.message;
    return "Something went wrong. Please try again.";
};

//l'action qui gére l'enregistrement d'un utilisateur
export const register = (newUser, navigate) => async (dispatch) => {
    dispatch({ type: LOAD_AUTH })
    try {
        const result = await axios.post("/api/auth/register", newUser)
        localStorage.setItem("token", result.data.token);
        dispatch({ type: SUCCESS_AUTH, payload: result.data })
        dispatch(mergeServerCart())
        dispatch(getWishlist())
        // navigate to profile if success
        navigate('/profile')

    } catch (error) {
        dispatch({ type: FAIL_AUTH, payload: extractAuthError(error) });
    }
};
//l'action qui gére la connexion d'un utilisateur
export const login = (user , navigate ) => async (dispatch) => {
    dispatch({ type: LOAD_AUTH })
    try {
        const result = await axios.post("/api/auth/login", user)
        localStorage.setItem("token", result.data.token);
        dispatch({ type: SUCCESS_AUTH, payload: result.data })
        dispatch(mergeServerCart())
        dispatch(getWishlist())
        navigate('/profile')
    } catch (error) {
        dispatch({ type: FAIL_AUTH, payload: extractAuthError(error) });
    }
};
// l'action qui gére la personne qui est connecté
export const current = () => async (dispatch) => {
    dispatch({ type: LOAD_AUTH });
    try {
        const config = {
            headers: {
                authorization: localStorage.getItem("token")
            }
        
    }
        const result = await axios.get("/api/auth/current", config)
    dispatch({ type: CURRENT_AUTH, payload: result.data })
    dispatch(mergeServerCart())
    dispatch(getWishlist())
} catch {
    // current() tourne silencieusement a chaque montage de App, y compris
    // pour un visiteur non connecte (pas de token / token expire) : ce n'est
    // pas une erreur a afficher sur les pages Login/Register, juste l'etat
    // "pas connecte". On ne peuple donc pas `errors` ici.
    dispatch({ type: FAIL_AUTH, payload: null });
}
}
// se déconnecter : logout
export const logout = (navigate) => async (dispatch) => {
    dispatch({ type: LOGOUT_AUTH })
    navigate('/login')
};

// met a jour les informations du profil (nom, email, telephone, mot de passe optionnel)
export const updateProfile = (updates) => async (dispatch) => {
    try {
        const config = { headers: { authorization: localStorage.getItem("token") } };
        const result = await axios.patch("/api/auth/profile", updates, config);
        dispatch({ type: UPDATE_USER_SUCCESS, payload: result.data });
        return { success: true };
    } catch (error) {
        const msg = extractAuthError(error);
        dispatch({ type: FAIL_AUTH, payload: msg });
        return { success: false, error: msg };
    }
};

// ajoute une adresse de livraison au profil
export const addAddress = (address) => async (dispatch) => {
    try {
        const config = { headers: { authorization: localStorage.getItem("token") } };
        const result = await axios.post("/api/auth/addresses", address, config);
        dispatch({ type: UPDATE_USER_SUCCESS, payload: result.data });
        return { success: true };
    } catch (error) {
        return { success: false, error: extractAuthError(error) };
    }
};

// modifie une adresse existante
export const updateAddress = (addressId, address) => async (dispatch) => {
    try {
        const config = { headers: { authorization: localStorage.getItem("token") } };
        const result = await axios.patch(`/api/auth/addresses/${addressId}`, address, config);
        dispatch({ type: UPDATE_USER_SUCCESS, payload: result.data });
        return { success: true };
    } catch (error) {
        return { success: false, error: extractAuthError(error) };
    }
};

// demande de reset de mot de passe (page ForgotPassword) - pas de dispatch : aucun autre
// composant n'a besoin de cet etat, la page gere son propre affichage de succes/erreur
export const forgotPassword = async (email) => {
    try {
        const { data } = await axios.post("/api/auth/forgot-password", { email });
        return { success: true, message: data.message };
    } catch (error) {
        return { success: false, error: extractAuthError(error) };
    }
};

// applique le nouveau mot de passe (page ResetPassword)
export const resetPassword = async (token, password) => {
    try {
        const { data } = await axios.post(`/api/auth/reset-password/${token}`, { password });
        return { success: true, message: data.message };
    } catch (error) {
        return { success: false, error: extractAuthError(error) };
    }
};

// supprime une adresse du profil
export const deleteAddress = (addressId) => async (dispatch) => {
    try {
        const config = { headers: { authorization: localStorage.getItem("token") } };
        const result = await axios.delete(`/api/auth/addresses/${addressId}`, config);
        dispatch({ type: UPDATE_USER_SUCCESS, payload: result.data });
        return { success: true };
    } catch (error) {
        return { success: false, error: extractAuthError(error) };
    }
};