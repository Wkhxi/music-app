import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components';
import BScroll from "better-scroll"
import PropTypes from "prop-types"

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Scroll = forwardRef((props, ref) => {
  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;
  const { pullUp, pullDown, onScroll } = props;

  const scrollContaninerRef = useRef();

  const [bScroll, setBScroll] = useState();


  //实例绑定 scroll 事件
  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === 'horizontal',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    });

    setBScroll(scroll)

    return () => {
      setBScroll(null)
    }

    // 第二个参数传入空数组 时
    // React Hook useEffect has missing dependencies: 'bounceBottom', 'bounceTop', 'click', and 'direction'. Either include them or remove the dependency array.
    // eslint-disable-next-line
  }, []);


  // 上拉到底，调用上拉刷新的函数
  useEffect(() => {
    if (!bScroll || !onScroll) { return };
    bScroll.on('scroll', () => {
      onScroll();
    });

    return () => {
      bScroll.off('scroll')
    }
  }, [bScroll, onScroll]);

  // 下拉到底，调用下拉刷新的函数
  useEffect(() => {
    if (!bScroll || !pullUp) { return };

    bScroll.on('scrollEnd', () => {

      // 当还没划到底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUp();
      };
    });

    return () => {
      bScroll.off('scrollEnd');
    }
  }, [pullUp, bScroll]);

  useEffect(() => {
    if(!bScroll || !pullDown) { return };
    bScroll.on('touchEnd', (pos) => {
      //判断用户的下拉动作
      if(pos.y > 50) {
        pullDown();
      }
    });
    return () => {
      bScroll.off('touchEnd');
    }
  }, [pullDown, bScroll]);


  useEffect(() => {
    if(refresh && bScroll){
      bScroll.refresh();
    }
  });


  // 给外界暴露组件方法
  // scrollRef.current.refresh (); 刷新 scroll 组件
  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll;
      }
    }
  }));


  return (
    <ScrollContainer ref={ scrollContaninerRef }>
      { props.children }
    </ScrollContainer>
  )
});


Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll:null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
};

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool, //是否支持向上吸顶
  bounceBottom: PropTypes.bool //是否支持向上吸顶
};



// forwardRef 函数组件第二个参数接收ref
export default Scroll;