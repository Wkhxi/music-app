/**
 * 自定义 走马灯 组件
*/


import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
const Content = styled.div`
 width: 100%;
 overflow: hidden;
 position: relative;
 height: 32px;
`;


const Marquee = (props) => {
  const txt = useRef();
  const outer = useRef();
  useEffect(() => {
    // 初始化时 outerWidth === txtWidth
    // 比如初始时 是 365px
    const outerWidth = outer.current.offsetWidth;
    const txtWidth = txt.current.offsetWidth;

    // console.log('Marquee', outerWidth, txtWidth)
    let w = outerWidth;
    const inter = setInterval(() => {
      // x轴 正方向为 右侧

      // 第1次循环时 translate(374px) 此时 txtDom 向右偏移了374px 被彻底遮盖
      // 第2次循环时 translate(373px)
      // 第3次循环时 translate(372px)
      // ...
      // 第365次循环时 translate(0px)  此时 txtDom 就在屏幕中 未产生任何偏移时的状态
      // ...
      // 第365 + 364次循环时 translate(-364px)  此时 txtDom 往左滑动过程中 被彻底遮盖住
      // 第365 + 365次循环时 translate(365)  此时 根据下面的判断 初始化状态 重新循环
      w = (w + txtWidth) === 0 ? outerWidth : w - 1;
      txt.current.style.transform = `translate(${w}px)`;
    }, 10);
    return () => {
      clearInterval(inter);
    };
  }, []);


  return (
    <Content ref={ outer }>
      <div ref={ txt }>
        { props.children }
      </div>
    </Content>
  )
};
export default Marquee;