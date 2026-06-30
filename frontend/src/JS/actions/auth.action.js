import { LOAD_AUTH, SUCCESS_AUTH, FAIL_AUTH, CURRENT_AUTH, LOGOUT_AUTH } from "../actionsType/auth.actionType";
import axios from "axios";


//l'action qui gére l'enregistrement d'un utilisateur
export const register = (newUser, navigate) => async (dispatch) => {
    dispatch({ type: LOAD_AUTH })
    try {
        console.log(newUser)
        const result = await axios.post("/api/auth/register", newUser)
        console.log(result)
        localStorage.setItem("token", result.data.token);
        dispatch({ type: SUCCESS_AUTH, payload: result.data })
        // navigate to profile if success 
        navigate('/profile')

    } catch (error) {
        dispatch({ type: FAIL_AUTH, payload: error.response.data.msg });
        console.log(error.response)
    }
};
//l'action qui gére la connexion d'un utilisateur 
export const login = (user , navigate ) => async (dispatch) => {
    dispatch({ type: LOAD_AUTH })
    try {
        const result = await axios.post("/api/auth/login", user)
        localStorage.setItem("token", result.data.token);
        dispatch({ type: SUCCESS_AUTH, payload: result.data })
        navigate('/profile') 
    } catch (error) {
        dispatch({ type: FAIL_AUTH, payload: error.response.data.statusText });
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
} catch (error) {
    dispatch({ type: FAIL_AUTH, payload: error.response.data.errors });
}
}
// se déconnecter : logout
export const logout = (navigate) => async (dispatch) => {
    dispatch({ type: LOGOUT_AUTH })
    navigate('/login')
};