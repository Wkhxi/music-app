import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Container, TopDesc, Menu } from './style';
import { CSSTransition } from 'react-transition-group';
import  Header  from './../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import { isEmptyObject } from '../../api/utils';
import style from '../../assets/global-style';
import { connect } from 'react-redux';
import { getAlbumList, changeEnterLoading } from './store/actionCreators';
import Loading from '../../baseUI/loading/index';
import SongsList from '../SongsList';
import MusicNote from "../../baseUI/music-note/index";


// export const getName = list => {
//   let str = '';
//   list.map((item, index) => {
//     str += index === 0 ? item.name : '/' + item.name;
//     return item;
//   });
//   return str;
// };





function Album(props) {

  // const currentAlbum = {
  //   creator: {
  //     avatarUrl: "http://p1.music.126.net/O9zV6jeawR43pfiK2JaVSw==/109951164232128905.jpg",
  //     nickname: "浪里推舟"
  //   },
  //   coverImgUrl: "http://p2.music.126.net/ecpXnH13-0QWpWQmqlR0gw==/109951164354856816.jpg",
  //   subscribedCount: 2010711,
  //   name: "听完就睡，耳机是天黑以后柔软的梦境",
  //   tracks:[
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //     {
  //       name: "我真的受伤了",
  //       ar: [{name: "张学友"}, {name: "周华健"}],
  //       al: {
  //         name: "学友 热"
  //       }
  //     },
  //   ]
  // }

  /**
   * 获取数据
   */
  const id = props.match.params.id;
  const { currentAlbum: currentAlbumImmutable, enterLoading } = props;
  const { getAlbumDataDispatch } = props;
  const musicNoteRef = useRef ();
  useEffect (() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);

  let currentAlbum = currentAlbumImmutable.toJS();



  const HEADER_HEIGHT = 45;

  const [showStatus, setShowStatus] = useState(true);
  // 是否有跑马灯效果
  const [isMarquee, setIsMarquee] = useState(false);
  const [title, setTitle] = useState("歌单");

  const headerEl = useRef();


  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);
  const handleScroll = useCallback((pos) => {
    // console.log('121', pos)
    let minScrollY = -HEADER_HEIGHT;
    // 当向上滑动 y 距离 小于 45    即 opacity = 1  backgroundColor = ''
    // 当向上滑动 y 距离 大于 45    percent > 1    1 > (percent-1)/2 > 0  此时透明度为 (percent - 1) / 2
    // 当向上滑动 y 距离 大于 135    percent > 3    (percent-1)/2 > 1  此时透明度为 1  backgroundColor = style["theme-color"]
    let percent = Math.abs(pos.y / minScrollY);
    let headerDom = headerEl.current;
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) { // ~ -45
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
      setTitle(currentAlbum.name);
      setIsMarquee(true);
    } else { // -45 ~ 0
      headerDom.style.backgroundColor = '';
      headerDom.style.opacity = 1;
      setTitle("歌单");
      setIsMarquee(false);
    }
  }, [currentAlbum]);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  /**
   * render拆分
   */
  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt=""/>
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor (currentAlbum.subscribedCount/1000)/10} 万 </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt=""/>
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  };
  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  };
  // const renderSongList = () => {
  //   return (
  //     <SongList>
  //       <div className="first_line">
  //         <div className="play_all">
  //           <i className="iconfont">&#xe6e3;</i>
  //           <span > 播放全部 <span className="sum">(共 { currentAlbum.tracks.length } 首)</span></span>
  //         </div>
  //         <div className="add_list">
  //           <i className="iconfont">&#xe62d;</i>
  //           <span > 收藏 ({ getCount(currentAlbum.subscribedCount) })</span>
  //         </div>
  //       </div>
  //       <SongItem>
  //         {
  //           currentAlbum.tracks.map((item, index) => {
  //             return (
  //               <li key={ index }>
  //                 <span className="index">{ index + 1 }</span>
  //                 <div className="info">
  //                   <span>{ item.name }</span>
  //                   <span>
  //                     { getName(item.ar) } - { item.al.name }
  //                   </span>
  //                 </div>
  //               </li>
  //             )
  //           })
  //         }
  //       </SongItem>
  //     </SongList>
  //   )
  // };


  return (
    <CSSTransition
      in={ showStatus }
      timeout={ 300 }
      classNames="fly"
      appear={ true }
      unmountOnExit
      onExited={ props.history.goBack } // 在退出动画执行结束时跳转路由
    >
      <Container>
        <Header ref={ headerEl } title={ title } handleClick={ handleBack } isMarquee={ isMarquee }></Header>
        {
          !isEmptyObject(currentAlbum) ?
            (
              <Scroll bounceTop={ false } onScroll={ handleScroll }>
                <div>
                  { renderTopDesc() }
                  { renderMenu() }
                  {/* { renderSongList() } */}
                  <SongsList
                    songs={ currentAlbum.tracks }
                    collectCount={ currentAlbum.subscribedCount }
                    showCollect={ true }
                    showBackground={ true }
                    musicAnimation={ musicAnimation }
                  ></SongsList>
                </div>
              </Scroll>
            )
            : null
        }
        <MusicNote ref={ musicNoteRef }></MusicNote>
        { enterLoading ? <Loading></Loading> : null }
      </Container>
    </CSSTransition>
  )
}


// export default React.memo(Album);

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  currentAlbum: state.album.getIn(['currentAlbum']),
  enterLoading: state.album.getIn(['enterLoading']),
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));