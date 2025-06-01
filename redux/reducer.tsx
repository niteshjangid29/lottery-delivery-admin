import { combineReducers } from "redux";
import userReducer from "./slice/adminSlice"
const minReducer = combineReducers({
  user: userReducer
});

export default minReducer;
