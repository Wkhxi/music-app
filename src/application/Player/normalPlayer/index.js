/**
 * 全屏的播放器
 */

import React, { useRef } from "react";
import { getName, formatPlayTime } from "../../../api/utils";
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  Operators,
  CDWrapper,
  ProgressWrapper
} from "./style";
import { CSSTransition } from "react-transition-group";
import animations from "create-keyframe-animation";
import { prefixStyle } from "../../../api/utils";
import ProgressBar from "../../../baseUI/progress-bar/index";
import { playMode } from './../../../api/config';


/**
 * create-keyframe-animation
 *
 * js实现帧动画
 *
 * 用js动态写 keyframe ，因为屏幕大小不一样，会导致需要移动的px不一样，所以要动态计算
*/


function NormalPlayer (props) {

  const { song, fullScreen, percent, playing, currentTime, mode } =  props;
  const { toggleFullScreen, clickPlaying, onProgressChange, handlePrev, handleNext, changeMode } = props;

  const normalPlayerRef = useRef();
  const cdWrapperRef = useRef();

  // 对不同浏览器的 transform属性进行兼容
  const transform = prefixStyle("transform");


  /**
   * 帧动画 的 钩子函数
   */
  // 获取偏移量
  const _getPosAndScale = () => {
    const targetWidth = 40; // 底部播放器宽度 -- 小圆
    const paddingLeft = 40; // 底部播放器 圆心 -- 到 最左边界的距离
    const paddingBottom = 30;  // 底部播放器 圆心 -- 到 底部边界的距离
    const paddingTop = 80;
    const width = window.innerWidth * 0.8; // 全屏播放器cd宽度  -- 大圆
    const scale = targetWidth / width; // 小圆 变成 大圆 缩小多少倍
    //  底部播放器的圆心和全屏播放器的圆心   两个圆心的横坐标距离和纵坐标距离

    // 因为 坐标系的原点在左上角
    // 从大圆 到 小圆  ： x负方向移动 y正方向移动
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return {
      x,
      y,
      scale
    };
  };
  const enter = () => {
    normalPlayerRef.current.style.display = 'block';
    const { x, y, scale } = _getPosAndScale(); //获取miniPlayer图片中心相对normalPlayer唱片中心的偏移
    let animation = {
      0: { // 第0帧 大圆 缩在左下角
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      60: { // 60% 大圆回到原位置 并 放大 0.1
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: { // 恢复到原大小，产生一个回弹效果
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    };

    // 动画配置
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear"
      }
    });

    //运行动画
    animations.runAnimation(cdWrapperRef.current, "move");
  };
  const afterEnter = () => {
    // 进入后解绑帧动画
    const cdWrapperDom = cdWrapperRef.current;
    animations.unregisterAnimation("move");
    cdWrapperDom.style.animation = '';
  };

  const leave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = 'all 0.4s';
    const { x, y, scale } = _getPosAndScale();
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = '';
    cdWrapperDom.style[transform] = '';
    normalPlayerRef.current.style.display = 'none';
  };


  /**
   * 切换模式
  */
  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = "&#xe625;";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
    } else {
      content = "&#xe61b;";
    }
    return content;
  };




  return (
    <CSSTransition
      classNames="normal"
      in={ fullScreen }
      timeout={ 400 }
      mountOnEnter
      onEnter={ enter }
      onEntered={ afterEnter }
      onExit={ leave }
      onExited={ afterLeave }
    >
      <NormalPlayerContainer ref={ normalPlayerRef }>
        <div className="background">
          <img
            src={ song.al.picUrl + '?param=300x300' }
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className="background layer"></div>
        <Top className="top">
          <div className="back" onClick={() => toggleFullScreen(false)}>
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <h1 className="title">{ song.name }</h1>
          <h1 className="subtitle">{ getName(song.ar) }</h1>
        </Top>
        <Middle ref={ cdWrapperRef }>
          <CDWrapper>
            <div className="cd">
              <img
                className={ `image play${playing ? '' : 'pause'}` }
                src={ song.al.picUrl + '?param=400x400' }
                alt=""
              />
            </div>
          </CDWrapper>
        </Middle>
        <Bottom className="bottom">
          {/* 进度条 */}
          <ProgressWrapper>
            {/* x:xx */}
            <span className="time time-l">{ formatPlayTime(currentTime) }</span>
            <div className="progress-bar-wrapper">
              <ProgressBar percent={ percent } percentChange={ onProgressChange }></ProgressBar>
            </div>
            <div className="time time-r">4:17</div>
          </ProgressWrapper>
          {/* 控制栏 */}
          <Operators>
            <div className="icon i-left" onClick={ changeMode }>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></i>
            </div>
            <div className="icon i-left" onClick={ handlePrev }>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={ e => clickPlaying(e, !playing) }
                dangerouslySetInnerHTML={ {__html: playing ? '&#xe723;' : '&#xe731;'} }
              ></i>
            </div>
            <div className="icon i-right" onClick={ handleNext }>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div className="icon i-right">
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}


export default React.memo(NormalPlayer);