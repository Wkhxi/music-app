import React from 'react';
import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont';
import routes from './routes';
import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { Data } from './application/Singers/data';

function App() {
  return (
    // 注入store
    <Provider store={ store }>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        {/* <i className="iconfont">&#xe6fc;</i> */}
        {/* 注册路由 */}
        <Data>
          { renderRoutes(routes) }
        </Data>
      </HashRouter>
    </Provider>
  )
}

export default App;
