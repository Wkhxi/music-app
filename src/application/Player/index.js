import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen
} from "./store/actionCreators";
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';
import { getSongUrl, isEmptyObject, findIndex, shuffle } from "../../api/utils";
import Toast from "./../../baseUI/toast/index";
import { playMode } from '../../api/config';
import PlayList from './play-list/index';
import { getLyricRequest } from "../../api/request";



function Player (props) {

  // const currentSong = {
  //   al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg" },
  //   name: "木偶人",
  //   ar: [{name: "薛之谦"}]
  // }
  // const playList = [
  //   {
  //     ftype: 0,
  //     djId: 0,
  //     a: null,
  //     cd: '01',
  //     crbt: null,
  //     no: 1,
  //     st: 0,
  //     rt: '',
  //     cf: '',
  //     alia: [
  //       '手游《梦幻花园》苏州园林版推广曲'
  //     ],
  //     rtUrls: [],
  //     fee: 0,
  //     s_id: 0,
  //     copyright: 0,
  //     h: {
  //       br: 320000,
  //       fid: 0,
  //       size: 9400365,
  //       vd: -45814
  //     },
  //     mv: 0,
  //     al: {
  //       id: 84991301,
  //       name: '拾梦纪',
  //       picUrl: 'http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg',
  //       tns: [],
  //       pic_str: '109951164627180052',
  //       pic: 109951164627180050
  //     },
  //     name: '拾梦纪',
  //     l: {
  //       br: 128000,
  //       fid: 0,
  //       size: 3760173,
  //       vd: -41672
  //     },
  //     rtype: 0,
  //     m: {
  //       br: 192000,
  //       fid: 0,
  //       size: 5640237,
  //       vd: -43277
  //     },
  //     cp: 1416668,
  //     mark: 0,
  //     rtUrl: null,
  //     mst: 9,
  //     dt: 234947,
  //     ar: [
  //       {
  //         id: 12084589,
  //         name: '妖扬',
  //         tns: [],
  //         alias: []
  //       },
  //       {
  //         id: 12578371,
  //         name: '金天',
  //         tns: [],
  //         alias: []
  //       }
  //     ],
  //     pop: 5,
  //     pst: 0,
  //     t: 0,
  //     v: 3,
  //     id: 1416767593,
  //     publishTime: 0,
  //     rurl: null
  //   }
  // ];

  const { fullScreen, playing, currentSong: immutableCurrentSong, playList: immutablePlayList, currentIndex, mode, sequencePlayList: immutableSequencePlayList } = props;
  const { toggleFullScreenDispatch, togglePlayingDispatch,  changeCurrentIndexDispatch, changeCurrentDispatch, changeModeDispatch, changePlayListDispatch, togglePlayListDispatch } = props;
  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  //歌曲总时长
  const [duration, setDuration] = useState(0);
  //歌曲播放进度
  // currentTime改变 触发组件重新render，这句话会重新执行，更新percent
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const [preSong, setPreSong] = useState({});
  const [modeText, setModeText] = useState('');
  const [songReady, setSongReady] = useState(true); // audio 标签拿到 src 加载到能够播放之间有一个缓冲的过程



  const audioRef = useRef();
  const toastRef = useRef();

  /**
   * 获取歌词
   */
  const currentLyric = useRef ();
  const getLyric = id => {
    let lyric = '';
    getLyricRequest(id)
      .then(data => {
        console.log('lyric', data)
        lyric = data.lrc.lyric;
        if (!lyric) {
          currentLyric.current = null;
          return;
        }
      })
      .catch (() => {
        songReady.current = true;
        audioRef.current.play();
      });
  };


  useEffect(() => {
    // currentSong 初始化的时候为 {}
    // if(!currentSong) return;
    // changeCurrentIndexDispatch(0); //currentIndex默认为-1，临时改成0

    if (!playList.length || currentIndex === -1 || !playList[currentIndex] || playList[currentIndex].id === preSong.id || !songReady) {
      return;
    }
    let current = playList[currentIndex];
    changeCurrentDispatch(current); //赋值currentSong
    setPreSong(current);
    setSongReady(false)

    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play().then(() => {
        setSongReady(true)
      });
    });
    togglePlayingDispatch(true); //播放状态

    getLyric(current.id); // 获取歌词
    setCurrentTime(0); //从头开始播放

    // 一个数 和 0 按位或， 整数可以保持自身，小数可以取整
    // 234947毫秒  -- 234.947秒 -- 234秒
    setDuration((current.dt / 1000) | 0);//时长

    //eslint-disable-next-line
  }, [playList, currentIndex]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  /**
   * 点击miniPlayer 的播放
  */
  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  };

  /**
   * audio播放时不断触发 onTimeUpdate 更新currentTime当前时间
   */
  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  }
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  }
  const handleError = () => {
    setSongReady(true);
    alert ("播放出错");
  };

  /**
   * 手动改变滚动条，更新当前时间，更新进度
   */
  const onProgressChange = (curPercent)=> {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) { // 手动改变进度条，如果是停播模式，就自动切换为播放模式
      togglePlayingDispatch(true);
    }
  }

  /**
   * handlePrev 上一曲
   * handleNext 下一曲
   * handleLoop 循环
   * changeMode 切换模式 ：单曲循环 顺序播放 随机播放
   */
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true);
    // audioRef.current.play();
  };
  const handlePrev = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) {
      togglePlayingDispatch(true)
    }
    changeCurrentIndexDispatch(index)
  }
  const handleNext = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  }
  const changeMode = () => {
    let newMode = (mode + 1) % 3; // 点击一下，换成下一个模式
    if (newMode === 0) { //顺序模式
      // sequencePlayList 永远是 初始顺序的列表
      // playList 是 根据不同模式 改变的列表

      // 比如：点击一个歌单，获取到 songsList
      // sequencePlayList 和 playList 都等于 songsList
      // 在播放过程中，根据模式 改变 playList

      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText('顺序播放');
    } else if (newMode === 1) { //单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText('单曲循环');
    } else if (newMode === 2) { //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText('随机播放');
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  }



  return (
    <div>
      {/* 传入当前播放歌曲数据 currentSong */}
      {/* 底部播放器 */}
      {
        isEmptyObject(currentSong) ? null :
        <MiniPlayer
          song={ currentSong }
          fullScreen={ fullScreen }
          playing={ playing }
          percent={ percent }
          toggleFullScreen={ toggleFullScreenDispatch }
          clickPlaying={ clickPlaying }
          togglePlayList={ togglePlayListDispatch }
        />
      }

      {/* 全屏播放器 */}
      {
        isEmptyObject(currentSong) ? null :
        <NormalPlayer
          song={ currentSong }
          fullScreen={ fullScreen }
          playing={ playing }
          percent={ percent }
          duration={ duration }
          currentTime={ currentTime }
          mode={ mode }
          toggleFullScreen={ toggleFullScreenDispatch }
          clickPlaying={ clickPlaying }
          onProgressChange={ onProgressChange }
          handlePrev={ handlePrev }
          handleNext={ handleNext }
          changeMode={ changeMode }
          togglePlayList={ togglePlayListDispatch }
        />
      }


      <audio ref={ audioRef } onTimeUpdate={ updateTime } onEnded={ handleEnd } onError={ handleError } autoPlay></audio>
      <Toast text={ modeText } ref={ toastRef }></Toast>
      <PlayList></PlayList>
    </div>
  )
}

const mapStateToProps = state => ({
  fullScreen: state.player.getIn(['fullScreen']),
  playing: state.player.getIn(['playing']),
  currentSong: state.player.getIn(['currentSong']),
  showPlayList: state.player.getIn(['showPlayList']),
  mode: state.player.getIn(['mode']),
  currentIndex: state.player.getIn(['currentIndex']),
  playList: state.player.getIn(['playList']),
  sequencePlayList: state.player.getIn(['sequencePlayList'])
});

const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));






/**
 * 
 * 1. 初始化播放一个音频
 *    获取duration，歌曲总时间
 *    设置currentTime 为 0
 *    计算出初始进度为 0
 *    音频播放时 不断触发 onTimeUpdate --> 更新currentTime --> 更新percent --> 更新进度条
 *
 *
 * 2. 手动拖动进度条
 *    根据进度条的长度比 --> 更新percent  -> 根据 duration * percent 更新currentTime
 */