import React from "react";
import { renderRoutes } from 'react-router-config'
import { Top } from './style'


function Home (props) {
  // console.log('home', props)
  const { route } = props
  return (
    <>
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span className="iconfont search">&#xe62b;</span>
      </Top>
      { renderRoutes(route.routes) }
    </>
  )
}


export default React.memo(Home);