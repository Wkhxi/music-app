// 模拟实现一个 redux


import React, { createContext, useReducer } from "react";
import { fromJS } from "immutable";



// context  深层次嵌套组件传值
export const CategoryDataContext = createContext({});

// constants
export const CHANGE_CATEGORY = 'singers/CHANGE_CATEGORY';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';

// reducer
const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CATEGORY:
      return state.set('category', action.data);
    case CHANGE_ALPHA:
      return state.set('alpha', action.data);
    default:
      return state;
  }
}


// Provider 组件
export const Data = (props) => {

  // data 是 return的state值
  // dispatch 用来发布事件 更新state
  const [data, dispatch] = useReducer(
    reducer, // reducer纯函数
    fromJS({ // 初始值
      category: '',
      alpha: ''
    })
  );

  return (
    <CategoryDataContext.Provider
      value={ { data, dispatch } }
    >
      { props.children }
    </CategoryDataContext.Provider>
  )
}