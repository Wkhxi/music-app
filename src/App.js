import React from 'react';
import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont';
import routes from './routes';
import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom'  


function App() {
  return (
    <HashRouter>
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <i className="iconfont">&#xe6fc;</i>
      {/* 注册路由 */}
      { renderRoutes(routes) }
    </HashRouter>
  )
}

export default App;
