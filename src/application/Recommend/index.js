import React, { useEffect } from "react";
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import { Content } from './style';
import Scroll from '../../baseUI/scroll/index';
import * as actionTypes from './store/actionCreators';
import { connect } from "react-redux";
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading/index';
import { renderRoutes } from 'react-router-config';

function Recommend (props) {

  console.log('12', props)

  const { bannerList, recommendList, enterLoading, songsCount } = props;
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props




  useEffect(() => {
    // 如果页面有数据，则不发请求
    if (!bannerList.size) {
      getBannerDataDispatch();
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch();
    }
    //eslint-disable-next-line
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];


  console.log('func3')

  return (
    // better-scroll 的原理，就是在容器元素高度固定，当子元素高度超过容器元素高度时，通过 transfrom 动画产生滑动效果
    // Content 就是 外部容器
    <Content play={ songsCount }>
      {/* onScroll={forceCheck} 随着页面滚动依次加载图片 */}
      <Scroll className="list" onScroll={ forceCheck }>
        <div>
          {/* 轮播 */}
          <Slider bannerList={ bannerListJS }></Slider>
          {/* 推荐列表 */}
          <RecommendList recommendList={ recommendListJS }></RecommendList>
        </div>
      </Scroll>
      { enterLoading ? <Loading></Loading> : null }
      { renderRoutes(props.route.routes) }
    </Content>
  )
}


// 映射 state 到 props
const mapStateToProps = (state) => {
  // console.log('62', state.recommend)
  // state 是 combineReducers中的对象
  return {
    bannerList: state.recommend.getIn(['bannerList']),
    recommendList: state.recommend.getIn(['recommendList']),
    enterLoading: state.recommend.getIn(['enterLoading']),
    songsCount: state.player.getIn(['playList']).size
  }
}


// 映射 action 到 props
const mapDispatchToProps = (dispatch) => {
  // console.log('69', dispatch)
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList())
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList())
    }
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));