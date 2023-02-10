/**
 * 底部播放栏
 */

import React, { useRef } from 'react';
import {getName} from '../../../api/utils';
import { MiniPlayerContainer } from './style';
import { CSSTransition } from "react-transition-group";
import ProgressCircle from '../../../baseUI/progress-circle';

function MiniPlayer (props) {

  // song 当前播放歌曲
  const { song, fullScreen, playing, percent } =  props;
  const { toggleFullScreen, clickPlaying } = props;

  const miniPlayerRef = useRef();


  /**
   * CSSTransition
   * 
   * 当组件的in属性变为true时，组件的className将被赋值为 example-enter，并在下一刻添加example-enter-active的CSS class名。这些都是基于className属性的约定。即：原组件带有className="animate-rotate"，则enter状态时，变为"animate-rotate-enter"
   * 
   * in 开启和关闭动画
   * 
   * classNames 不同状态下有不同的className，比如： mini-enter,mini-enter-active,mini-enter-done,mini-exit,mini-exit-active,mini-exit-done, mini-appear 以及 mini-appear-active
   * 
   * onEnter 当组件enter或appear时会立即调用
   * 
   * onEntering  当组件enter-active或appear-active时，立即调用此函数
   * 
   * onEntered  当组件的enter,appear className被移除时，调用此函数
   * 
   * onExited   当组件exit类名被移除，且添加了exit-done类名时，调用此函数
   * 
   * 
   * xxx-enter : 入场动画开始
   * xxx-enter-active: 入场动画表现
   * xxx-enter-done: 入场动画结束
   */


  return (
    <CSSTransition
      in={ !fullScreen }
      timeout={ 400 }
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex';
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none';
      }}
    >
      <MiniPlayerContainer ref={ miniPlayerRef } onClick={ () => toggleFullScreen(true) }>
        <div className="icon">
          <div className="imgWrapper">
            {/* <img className="play" src={ song.al.picUrl } width="40" height="40" alt="img"/> */}
            <img className={`play ${playing ? '': "pause"}`} src={ song.al.picUrl } width="40" height="40" alt="img"/>
          </div>
        </div>
        <div className="text">
          <h2 className="name">{ song.name }</h2>
          <p className="desc">{ getName(song.ar) }</p>
        </div>
        <div className="control">
          {/* <i className="iconfont">&#xe650;</i> */}
          <ProgressCircle radius={ 32 } percent={ percent }>
            {/* <i className="icon-mini iconfont icon-pause">&#xe650;</i> */}
            { playing ?
              <i className="icon-mini iconfont icon-pause" onClick={ e => clickPlaying(e, false) }>&#xe650;</i>
              :
              <i className="icon-mini iconfont icon-play" onClick={ e => clickPlaying(e, true) }>&#xe61e;</i>
            }
          </ProgressCircle>
        </div>
        <div className="control">
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(MiniPlayer);