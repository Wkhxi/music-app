import React, { useEffect } from "react";
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import { Content } from './style';
import Scroll from '../../baseUI/scroll/index';
import * as actionTypes from './store/actionCreators';
import { connect } from "react-redux";


function Recommend (props) {

  console.log('12', props)

  const { bannerList, recommendList } = props;
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props



  // const bannerList = [1, 2, 3, 4].map(_e => {
  //   return {
  //     imageUrl: 'http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg'
  //   }
  // });

  // const recommendList = [1,2,3,4,5,6,7,8,9,10].map (item => {
  //   return {
  //     id: 1,
  //     picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
  //     playCount: 17171122,
  //     name: "朴树、许巍、李健、郑钧、老狼、赵雷"
  //   }
  // });



  useEffect(() => {
    getBannerDataDispatch();
    getRecommendListDataDispatch();
    //eslint-disable-next-line
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];


  // const clickEvent = () => {
  //   count += 1
  //   setCount(count)
  //   console.log('25', count)
  // }

  console.log('func3')

  return (
    // better-scroll 的原理，就是在容器元素高度固定，当子元素高度超过容器元素高度时，通过 transfrom 动画产生滑动效果
    // Content 就是 外部容器
    <Content>
      <Scroll className="list">
        <div>
          {/* 轮播 */}
          <Slider bannerList={ bannerListJS }></Slider>
          {/* 推荐列表 */}
          <RecommendList recommendList={ recommendListJS }></RecommendList>
        </div>
      </Scroll>
    </Content>
  )
}


// 映射 state 到 props
const mapStateToProps = (state) => {
  // console.log('62', state.recommend)
  // state 是 combineReducers中的对象
  return {
    bannerList: state.recommend.getIn(['bannerList']),
    recommendList: state.recommend.getIn(['recommendList'])
  }
}


// 映射 action 到 props
const mapDispatchToProps = (dispatch) => {
  console.log('69', dispatch)
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