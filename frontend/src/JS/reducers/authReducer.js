//importation des types d'action
import { LOAD_AUTH, SUCCESS_AUTH, FAIL_AUTH, CURRENT_AUTH, LOGOUT_AUTH, UPDATE_USER_SUCCESS } from "../actionsType/auth.actionType";





//initial state
const initialState = {
    isLoad: false,
    user: null,
    errors: [],
    success: [],
    isAuth: false,


}

//pure function
const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        // dans le cas de l'attente du loading 
        case LOAD_AUTH:
            return { ...state, isLoad: true }
        // dans le cas de la réussite de l'enregistrement ou de la connexion
        case SUCCESS_AUTH:
            return { ...state, isLoad: false, user: payload.user, success: payload.msg, isAuth: true }

        // dans le cas de la personne qui est connecté
        case CURRENT_AUTH:
            return { ...state, isLoad: false, user: payload.user, isAuth: true }
        // dans le cas d'une mise a jour du profil ou des adresses
        case UPDATE_USER_SUCCESS:
            return { ...state, isLoad: false, user: payload.user, errors: [] }
        // dans le cas de la déconnexion
        case FAIL_AUTH:
            return { ...state, isLoad: false, errors: payload}
        case LOGOUT_AUTH:
            localStorage.removeItem("token")
            return { ...state, isLoad: false, user: {}, success: [], errors: [], isAuth: false }
        default:
            return state ;
    } 
};

export default authReducer;