import React, {useEffect, useImperativeHandle, useRef, forwardRef} from 'react';
import styled from 'styled-components';
import { prefixStyle } from '../../api/utils';
import style from '../../assets/global-style';

const Container = styled.div`
  .icon_wrapper{
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style['theme-color']};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(.62,-0.1,.86,.57);
    transform: translate3d(0, 0, 0);
    >div{
      transition: transform 1s;
    }
  }
`

const MusicNote = forwardRef((props, ref) => {

  const iconsRef = useRef();

  const ICON_NUMBER = 10;

  const transform = prefixStyle('transform');

  const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    let tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    return tempNode.firstChild;
  }

  useEffect(() => {
    // 创建三个图标div 添加到 Container 中
    for(let i = 0; i < ICON_NUMBER; i++){
      // <div class='icon_wrapper'><div class="iconfont">&#xe642;</div></div>
      let node = createNode(`<div class="iconfont">&#xe642;</div>`);
      iconsRef.current.appendChild(node);
    }
    // 现在 Container下有三个 icon_wrapper 的div
    let domArray = [].slice.call(iconsRef.current.children)
    domArray.forEach(item => {
      item.running = false;
      item.addEventListener('transitionend', function() {
        console.log('this', this)
        this.style['display'] = 'none';
        this.style[transform] = `translate3d(0, 0, 0)`;
        this.running = false;

        let icon = this.querySelector('div');
        icon.style[transform] = `translate3d(0, 0, 0)`;
      }, false);
    });
    // eslint-disable-next-line
  }, []);

  const startAnimation = ({x, y}) => {
    for(let i = 0; i < ICON_NUMBER; i++) {
      let domArray = [].slice.call(iconsRef.current.children)
      let item = domArray[i]
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        // display 虽然变为了 inline-block, 但是元素显示出来需要 。浏览器的回流 过程，无法立即显示。 也就是说元素目前还是 隐藏 的，那么 元素的位置未知，导致 transform 失效
        item.style.display = 'inline-block';
        setTimeout(() => { // 将动画逻辑放到下一次的 宏任务。事实上，当本次的宏任务完成后， 会触发 浏览器 GUI 渲染线程 的重绘工作，然后才执行下一次宏任务，那么下一次宏任务中元素就显示了，transform 便能生效
          item.running = true;
          item.style[transform] = `translate3d(0, 750px, 0)`;
          let icon = item.querySelector('div');
          icon.style[transform] = `translate3d(-40px, 0, 0)`;
        }, 20);
        break;
      }
    }
  };

  useImperativeHandle(ref, () => ({
    startAnimation
  }));

  return (
    <Container ref={iconsRef}>
    </Container>
  )
})

export default React.memo(MusicNote);

