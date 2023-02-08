import { combineReducers } from "redux";

import { reducer as recommendReducer } from "../application/Recommend/store";
import { reducer as singerReducer } from '../application/Singers/store';
import { reducer as rankReducer } from '../application/Rank/store/index';
import { reducer as albumReducer } from '../application/Album/store/index';
import { reducer as singerInfoReducer } from '../application/Singer/store/index';

export default combineReducers({
  // recommend下的reducer 注册到全局store中
  recommend: recommendReducer,
  singers: singerReducer,
  rank: rankReducer,
  album: albumReducer,
  singerInfo: singerInfoReducer
});