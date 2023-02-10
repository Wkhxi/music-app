import React from 'react';
import styled from'styled-components';
import style from '../../assets/global-style';

const CircleWrapper = styled.div`
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center; // 变形的原点
    &.progress-background {
      transform: scale(0.9);
      stroke: ${style['theme-color-shadow']};
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: ${style['theme-color']};
    }
  }
`

function ProgressCircle(props) {

  const { radius, percent } = props;
  // 整个背景的周长
  const dashArray = Math.PI * 100; // Πd
  // 没有高亮的部分，剩下高亮的就是进度
  const dashOffset = (1 - percent) * dashArray;
  // console.log('dashArray', dashArray)
  // console.log('dashOffset', dashOffset)

  return (
    <CircleWrapper>
      <svg width={ radius } height={ radius } viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        {/* <circle> SVG 元素是一个 SVG 的基本形状，用来创建圆，基于一个圆心和一个半径 */}
        {/* (cx,cy)圆心  r半径 */}
        {/* stroke-width 定义一条线的 厚度 */}

        {/* 第一个圆的边 是 圆环的背景 */}
        {/* 第二个圆的边 是 圆环的进度条   通过颜色区分 */}
        <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
        {/* 可视区域 就是 周长dashArray */}
        {/* strokeDashoffset = 0 所有虚线都在可视区域，即进度条为 100% */}
        {/* strokeDashoffset = 20% * 100  虚线逆时针移动 20%*100，即进度条为 80% */}
        <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent" strokeDasharray={ dashArray } strokeDashoffset={ dashOffset }/>
      </svg>
      { props.children }
    </CircleWrapper>
  )
}

export default React.memo(ProgressCircle);

/**
 * svg
 *  矩形 <rect>
    圆形 <circle>
    椭圆 <ellipse>
    线 <line>
    折线 <polyline>
    多边形 <polygon>
    路径 <path>
 */

/**
 * strokeDasharray：
 * 
 * 一个参数时： 其实是表示虚线长度和每段虚线之间的间距
　　如：stroke-dasharray = '10' 表示：虚线长10，间距10，然后重复 虚线长10，间距10

    两个参数或者多个参数时：一个表示长度，一个表示间距
　　如：stroke-dasharray = '10, 5' 表示：虚线长10，间距5，然后重复 虚线长10，间距5
　　如：stroke-dasharray = '20, 10, 5' 表示：虚线长20，间距10，虚线长5，接着是间距20，虚线10，间距5，之后开始如此循环
 */

/**
 *  stroke-dashoffset：搭配stroke-dashoffset才能看得出来效果
 * 
 * 目的：原本的图形发生偏移，让用户只能看到在框框中的图形
 * 
 * 相对于起始点的偏移。
 * stroke-dashoffset = 0 的位置 打一个tag
 * 
 * stroke-dashoffset > 0     虚线整体往左移动（逆时针）
 * 
 * stroke-dashoffset < 0      虚线整体往右移动（顺时针）
 * 
 * 
 * 
 * 
 * 
 */