import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition } from "react-transition-group";
import { Container } from "./style";
import { ImgWrapper, CollectButton, SongListWrapper, BgLayer } from "./style";
import Header from "../../baseUI/header/index";
import Scroll from "../../baseUI/scroll/index";
import SongsList from "../SongsList";

import { HEADER_HEIGHT } from "./../../api/config";
import { connect } from 'react-redux';
import { getSingerInfo, changeEnterLoading } from "./store/actionCreators";
import Loading from "./../../baseUI/loading/index";
import MusicNote from "../../baseUI/music-note/index";


function Singer(props) {

  // mock数据
  // const artist = {
  //   picUrl: "https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg",
  //   name: "薛之谦",
  //   hotSongs: [
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     }
  //   ]
  // }
  const {
    artist: immutableArtist,
    songs: immutableSongs,
    loading
  } = props;
  const { getSingerDataDispatch } = props;
  const artist = immutableArtist.toJS();
  const songs = immutableSongs.toJS();

  const [showStatus, setShowStatus] = useState(true);

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();
  // 图片初始高度
  const initialHeight = useRef(0);
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;

  const musicNoteRef = useRef ();


  useEffect(() => {
    const id = props.match.params.id;
    getSingerDataDispatch(id);

    // songScrollWrapper 和 layer 向下偏移 图片imageWrapper的高度
    // 歌曲列表不会把图片遮盖住
    let h = imageWrapper.current.offsetHeight; // 293
    songScrollWrapper.current.style.top = `${h - OFFSET}px`; // px前面不能有空格，否则作用不上
    initialHeight.current = h;

    layer.current.style.top = `${h - OFFSET}px`;
    // console.log('mounted', h, layer, layer.current.style.top, `${h - OFFSET} px`)
    songScroll.current.refresh();
    //eslint-disable-next-line
  }, []);

  /**
   * 滑动组件
   */
  const handleScroll = useCallback(pos => {
    let height = initialHeight.current;
    const newY = pos.y; // 初始为0，向下滑动为正值，向上滑动为负值
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    // height - OFFSET 是顶部图片区域高度
    // HEADER_HEIGHT 头部title高度
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

    //指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);

    // console.log('newY', newY)
    // console.log('height', height)
    // console.log('minScrollY', minScrollY)

    if (newY > 0) { // 歌曲列表向下滑动，顶部图片被拉伸，按钮下移
      imageDOM.style['transform'] = `scale(${1 + percent})`;
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) { // 歌曲列表向上滑动，滑动 >= minScrollY 且 < 0 时，图片收缩
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      //这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      //按钮跟着移动且渐渐变透明
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style['opacity'] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) { // 歌曲列表向上滑动，滑动 < minScrollY 时，头部title不许被遮盖住
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100;
      //此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }, [])

  const setShowStatusFalse = useCallback(() => {
    setShowStatus (false);
  }, []);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };


  return (
    <CSSTransition
      in={ showStatus }
      timeout={ 300 }
      classNames="fly"
      appear={ true }
      unmountOnExit
      onExited={ () => props.history.goBack() }
    >
      <Container>
        <Header
          handleClick={ setShowStatusFalse }
          title={ artist.name }
          ref={ header }
        ></Header>
        <ImgWrapper ref={ imageWrapper } bgUrl={ artist.picUrl }>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={ collectButton }>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={ layer }></BgLayer>
        <SongListWrapper ref={ songScrollWrapper }>
          <Scroll ref={ songScroll } onScroll={ handleScroll }>
            <SongsList
              songs={ songs }
              showCollect={ false }
              musicAnimation={ musicAnimation }
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        <MusicNote ref={ musicNoteRef }></MusicNote>
        { loading ? (<Loading></Loading>) : null}
      </Container>
    </CSSTransition>
  )
}


const mapStateToProps = state => ({
  artist: state.singerInfo.getIn(['artist']),
  songs: state.singerInfo.getIn(['songsOfArtist']),
  loading: state.singerInfo.getIn(['loading']),
});

const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading (true));
      dispatch(getSingerInfo(id));
    }
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer));
