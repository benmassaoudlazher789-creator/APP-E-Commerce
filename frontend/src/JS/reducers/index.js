import { combineReducers } from "redux";
import authReducer from "./authReducer";
//combiner les reducers
const rootReducer = combineReducers({
    authReducer,
});
export default rootReducer;