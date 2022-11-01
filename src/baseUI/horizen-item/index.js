import React, { useState, useRef, useEffect, memo } from 'react';
import styled from'styled-components';
import Scroll from '../scroll/index'
import { PropTypes } from 'prop-types';
import style from '../../assets/global-style';

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  >span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style["font-size-m"]};
    vertical-align: middle;
  }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`





function Horizen (props) {

  const { list, oldVal, title } = props;
  const { handleClick } = props;

  const Category  = useRef(null);


  useEffect(() => {
    // 初始化页面时 计算内部div宽度
    let categoryDOM = Category.current;
    let tagElements = categoryDOM.querySelectorAll('span');
    let totalWidth = 0;
    Array.from(tagElements).forEach(ele => {
      totalWidth += ele.offsetWidth;
    });

    categoryDOM.style.width = `${totalWidth}px`;
  }, [])



  return (
    <Scroll direction={ 'horizontal' }>
      <div ref={ Category }>
        <List>
          <span>{ title }</span>
          {
            list.map(_e => {
              return (
                <ListItem key={ _e.key } className={ `${oldVal === _e.key ? 'selected' : ''}` } onClick={ () => handleClick(_e.key) }>
                  { _e.name }
                </ListItem>
              )
            })
          }
        </List>
      </div>
    </Scroll>
  )
}


Horizen.defaultProps = {
  // 列表数据
  list: [],
  // 当前item值
  // oldVal这个变量其实可以 就封装在这个组件里
  oldVal: '',
  title: '',
  handleClick: null
};

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
};


export default memo(Horizen);