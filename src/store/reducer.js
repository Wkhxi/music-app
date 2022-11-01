import { combineReducers } from "redux";

import { reducer as recommendReducer } from "../application/Recommend/store";


export default combineReducers({
  // recommend下的reducer 注册到全局store中
  recommend: recommendReducer
});