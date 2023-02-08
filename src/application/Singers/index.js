import React, { useContext, useEffect } from "react";
import Horizen from '../../baseUI/horizen-item';
import styled from'styled-components';
import { ListContainer, List, ListItem } from './style'
import Scroll from "../../baseUI/scroll";
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList
} from './store/actionCreators';
import { connect } from 'react-redux';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { CategoryDataContext } from "./data";
import { CHANGE_CATEGORY, CHANGE_ALPHA } from './data';
import { renderRoutes } from 'react-router-config';

const NavContainer  = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 95px;
  width: 100%;
  padding: 5px;
  overflow: hidden;
`;



function Singers (props) {

  const { pullUpLoading, pullDownLoading, pageCount, singerList } = props;
  const { updateDispatch, pullUpRefreshDispatch, pullDownRefreshDispatch, getHotSingerDispatch } = props;

  const { data, dispatch } = useContext(CategoryDataContext);
  const { category, alpha } = data.toJS();

  // let [category, setCategory] = useState('')
  // let [alpha, setAlpha] = useState('')

  useEffect(() => {
    // 通过redux实现缓存功能
    // 实现缓存功能
    if (!singerList.size) {
      getHotSingerDispatch();
    }
    // eslint-disable-next-line
  }, []);

  let handleUpdateCategory = (key) => {
    // setCategory(key);
    dispatch({ type: CHANGE_CATEGORY, data: key });
    updateDispatch(key, alpha);
  };
  let handleUpdateAlpha = (key) => {
    // setAlpha(key);
    dispatch({ type: CHANGE_ALPHA, data: key });
    updateDispatch(category, key);
  };
  let handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount);
  };

  let handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha)
  };

  /**
   * 跳转详情
   */
  const enterDetail = (id) => {
    props.history.push(`/singers/${id}`);
  }

  // 歌手种类
 const categoryTypes = [{
      name: "华语男",
      key: "1001"
    },
    {
      name: "华语女",
      key: "1002"
    },
    {
      name: "华语组合",
      key: "1003"
    },
    {
      name: "欧美男",
      key: "2001"
    },
    {
      name: "欧美女",
      key: "2002"
    },
    {
      name: "欧美组合",
      key: "2003"
    },
    {
      name: "日本男",
      key: "6001"
    },
    {
      name: "日本女",
      key: "6002"
    },
    {
      name: "日本组合",
      key: "6003"
    },
    {
      name: "韩国男",
      key: "7001"
    },
    {
      name: "韩国女",
      key: "7002"
    },
    {
      name: "韩国组合",
      key: "7003"
    },
    {
      name: "其他男歌手",
      key: "4001"
    },
    {
      name: "其他女歌手",
      key: "4002"
    },
    {
      name: "其他组合",
      key: "4003"
    },
  ];

  // 歌手首字母
  const alphaTypes = [{
      key: "A",
      name: "A"
    },
    {
      key: "B",
      name: "B"
    },
    {
      key: "C",
      name: "C"
    },
    {
      key: "D",
      name: "D"
    },
    {
      key: "E",
      name: "E"
    },
    {
      key: "F",
      name: "F"
    },
    {
      key: "G",
      name: "G"
    },
    {
      key: "H",
      name: "H"
    },
    {
      key: "I",
      name: "I"
    },
    {
      key: "J",
      name: "J"
    },
    {
      key: "K",
      name: "K"
    },
    {
      key: "L",
      name: "L"
    },
    {
      key: "M",
      name: "M"
    },
    {
      key: "N",
      name: "N"
    },
    {
      key: "O",
      name: "O"
    },
    {
      key: "P",
      name: "P"
    },
    {
      key: "Q",
      name: "Q"
    },
    {
      key: "R",
      name: "R"
    },
    {
      key: "S",
      name: "S"
    },
    {
      key: "T",
      name: "T"
    },
    {
      key: "U",
      name: "U"
    },
    {
      key: "V",
      name: "V"
    },
    {
      key: "W",
      name: "W"
    },
    {
      key: "X",
      name: "X"
    },
    {
      key: "Y",
      name: "Y"
    },
    {
      key: "Z",
      name: "Z"
    }
  ];

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS(): [];
    return (
      <List>
        {
          list.map((singer, index) => {
            return (
              <ListItem key={ singer.accountId + '' + index } onClick = { () => enterDetail(singer.id) }>
                <div className="img_wrapper">
                  {/* <img src={ `${singer.picUrl}?param=300*300` } width="100%" height="100%" alt="music" /> */}
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music"/>}>
                    <img src={`${singer.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">{ singer.name }</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }


  return (
    // 滚动原理
    // 首先外面容器要宽度固定，其次内容宽度要大于容器宽度。
    <>
      <NavContainer>
        <Horizen list={ categoryTypes } title={"分类 (默认热门):"} handleClick={ val => handleUpdateCategory(val) } oldVal={ category }></Horizen>
        <Horizen list={alphaTypes} title={"首字母:"} handleClick={ val => handleUpdateAlpha(val) } oldVal={ alpha }></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll pullUp={ handlePullUp } pullDown = { handlePullDown } pullUpLoading = { pullUpLoading } pullDownLoading = { pullDownLoading } onScroll={ forceCheck }>
          { renderSingerList () }
        </Scroll>
      </ListContainer>
      { renderRoutes(props.route.routes) }
    </>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.singers.getIn(['singerList']),
  enterLoading: state.singers.getIn(['enterLoading']),
  pullUpLoading: state.singers.getIn(['pullUpLoading']),
  pullDownLoading: state.singers.getIn(['pullDownLoading']),
  pageCount: state.singers.getIn(['pageCount'])
});

const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
    },
    updateDispatch(category, alpha) {
      // 改变分类 或 首字母 ，将分页清零
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      // 根据分类和首字母 搜索 歌手
      dispatch(getSingerList(category, alpha));
    },
    // 拉底部刷新
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count + 1));
      // 获取 相应搜索条件的 下一页数据
      if(hot){
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList(category, alpha));
      }
    },
    // 顶部下拉刷新
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0));
      // 获取相应搜索条件下的 第一页数据
      if(category === '' && alpha === ''){
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList(category, alpha));
      }
    }
  }
};




export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));