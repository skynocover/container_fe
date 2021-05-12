import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MacCommandOutlined, SaveOutlined, RobotOutlined } from '@ant-design/icons';
import * as antd from 'antd';
import { AppContext } from './AppContext';
import { CommandWrapper } from './pages/Command';
import * as ReactRouterDOM from 'react-router-dom';
import Menu, { MainPage } from './pages/MainPage';

import { Images } from './pages/Image';
import { Container } from './pages/Container';
import { LaunchPage } from './pages/LaunchPage';
import { NotFoundPage } from './pages/NotFoundPage';

const App = () => {
  const appCtx = React.useContext(AppContext);

  const menus: Menu[] = [
    {
      key: '/command',
      title: 'command',
      component: <CommandWrapper />,
      icon: <MacCommandOutlined />,
    },
    {
      key: '/image',
      title: 'image',
      component: <Images />,
      icon: <SaveOutlined />,
    },
    {
      key: '/contianer',
      title: 'contianer',
      component: <Container />,
      icon: <RobotOutlined />,
    },
  ];

  return (
    <ReactRouterDOM.HashRouter>
      <ReactRouterDOM.Switch>
        <ReactRouterDOM.Route path="/" exact component={LaunchPage} />
        {/* <ReactRouterDOM.Route path="/login" component={LoginPage} /> */}

        {menus.map((menu) => (
          <ReactRouterDOM.Route key={menu.key} path={menu.key}>
            <MainPage menus={menus} title={menu.title} icon={menu.icon} content={menu.component} />
          </ReactRouterDOM.Route>
        ))}

        <ReactRouterDOM.Route path="*" component={NotFoundPage} />
      </ReactRouterDOM.Switch>
    </ReactRouterDOM.HashRouter>
  );
};

export default App;
