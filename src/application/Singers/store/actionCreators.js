import { getHotSingerListRequest, getSingerListRequest } from '../../../api/request';
import { CHANGE_SINGER_LIST, CHANGE_PAGE_COUNT, CHANGE_ENTER_LOADING, CHANGE_PULLUP_LOADING, CHANGE_PULLDOWN_LOADING } from './constants'
import { fromJS } from 'immutable';



export const changeSingerList = (data) => ({
  type: CHANGE_SINGER_LIST,
  data: fromJS(data)
});

export const changePageCount = (data) => ({
  type: CHANGE_PAGE_COUNT,
  data
});

export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});

export const changePullUpLoading = (data) => ({
  type: CHANGE_PULLUP_LOADING,
  data
});

export const changePullDownLoading = (data) => ({
  type: CHANGE_PULLDOWN_LOADING,
  data
});


// 首次加载热门歌手数据
export const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0).then(res => {
      const data = res.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false));
    }).catch(() => {
      console.log('热门歌手数据获取失败')
    })
  }
};

// 获取 热门歌手 分页数据
export const refreshMoreHotSingerList = () => {
  return (dispatch, getState) => {
    // console.log('getState', getState, getState());
    const pageCount  = getState().singers.getIn(['pageCount']);
    const singerList = getState().singers.getIn(['singerList']).toJS();

    getHotSingerListRequest(pageCount).then(res => {
      const data = [...singerList, ...res.artists];
      dispatch(changeSingerList(data));
      dispatch(changePullUpLoading(false));
    }).catch(() => {
      console.log('热门歌手数据获取失败');
    })
  }
}

// 根据 分类和首字母 获取歌手数据
export const getSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    getSingerListRequest(category, alpha, 0).then(res => {
      const data = res.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false));
    }).catch(() => {
      console.log('歌手数据获取失败');
    });
  }
};

// 获取歌手 分页数据
export const refreshMoreSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    const pageCount = getState().singers.getIn(['pageCount']);
    const singerList = getState().singers.getIn(['singerList']).toJS();
    getSingerListRequest(category, alpha, pageCount).then(res => {
      const data = [...singerList, ...res.artists];
      dispatch(changeSingerList(data));
      dispatch(changePullUpLoading(false));
    }).catch(() => {
      console.log('歌手数据获取失败');
    });
  }
};








