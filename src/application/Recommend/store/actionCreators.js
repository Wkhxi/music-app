// 放不同的action

import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { getBannerRequest, getRecommendListRequest } from '../../../api/request';



export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data)
})

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data)
})

// 异步action
export const getBannerList = () => {
  return (dispatch) => {
    getBannerRequest().then(res => {
      // 相当于vue中的action中 commit一个mutation
      dispatch(changeBannerList(res.banners))
    }).catch(() => {
      console.log('轮播图数据错误');
    })

  }
};


export const getRecommendList = () => {
  return (dispatch) => {
    getRecommendListRequest().then(res => {
      dispatch(changeRecommendList(res.result))
    }).catch(() => {
      console.log('推荐歌单数据错误');
    })
  }
};

