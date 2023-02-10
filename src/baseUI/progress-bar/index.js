import React, {useEffect, useRef, useState } from 'react';
import styled from'styled-components';
import style from '../../assets/global-style';
import { prefixStyle } from './../../api/utils';

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style['theme-color']};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style['border-color']};
        border-radius: 50%;
        background: ${style['theme-color']};
      }
    }
  }
`

function ProgressBar (props) {

  const { percent } = props;
  const { percentChange } = props;

  const transform = prefixStyle('transform')
  const progressBar = useRef ();
  const progress = useRef ();
  const progressBtn = useRef ();
  const [touch, setTouch] = useState ({});

  const progressBtnWidth = 16;

  /**
   * 音频自动播放，自动更新进度条
   */
  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      const offsetWidth = percent * barWidth;
      // console.log('p-bar', percent, offsetWidth)
      progress.current.style.width = `${offsetWidth}px;`
      progressBtn.current.style[transform] = `translate3d(${offsetWidth}, 0, 0)`;
    }
    // eslint-disable-next-line
  }, [percent]);


  const _changePercent = () => {
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    const curPercent = progress.current.clientWidth / barWidth; // 新的进度计算
    percentChange(curPercent); // 拖动进度条改变进度，数据同步给父组件，更新左侧时间
  }

  const _offset = (offsetWidth) => {
    // console.log('_offset', offsetWidth)
    progress.current.style.width = `${offsetWidth}px`;
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  };


  /**
   * ontouchstart  手指按下
   * ontouchmove   手指移动
   * ontouchend    手指松开
   */
  const progressTouchStart = (e) => {
    // console.log('e', e, e.touches[0], e.touches[0].pageX, progress.current.clientWidth)
    const touchStart = {};
    touchStart.initiated = true; // 滑动开始
    touchStart.startX = e.touches[0].pageX; // 滑动起始位置
    touchStart.left = progress.current.clientWidth; // 进度条当前宽度
    setTouch(touchStart)

  }

  const progressTouchMove = (e) => {
    // console.log('65e', e, e.touches[0].pageX, progress.current.clientWidth, progressBar.current.clientWidth)
    if (!touch.initiated) return;
    const deltaX = e.touches[0].pageX - touch.startX; // 以按钮当前位置为起点，向 左右 拖动了多长
    // console.log('deltaX', deltaX)
    const barWidth = progressBar.current.clientWidth - progressBtnWidth; // 可滑动进度条宽度
    // touch.left + deltaX 是 进度条当前的长度，最小为0，最大为barWidth
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  }

  const progressTouchEnd = (e) => {
    const touchEnd = JSON.parse(JSON.stringify(touch));
    touchEnd.initiated = false;
    setTouch(touchEnd);

    _changePercent(); // 更新进度
  }

  /**
   * 点击按钮，改变进度
  */
  const progressClick = (e) => {
    // 进度条左边 到 视口左边的距离
    const rect = progressBar.current.getBoundingClientRect();

    // 点击点到视口左边的距离 - 进度条左边 到 视口左边的距离 = 进度条长度
    const offsetWidth = e.pageX - rect.left;
    _offset(offsetWidth);

    _changePercent(); // 更新进度
  }



  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={ progressBar } onClick={ progressClick }>
        <div className="progress" ref={ progress }></div>
        <div className="progress-btn-wrapper" ref={ progressBtn } onTouchStart={ progressTouchStart } onTouchMove={ progressTouchMove } onTouchEnd={ progressTouchEnd }>
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default React.memo(ProgressBar);