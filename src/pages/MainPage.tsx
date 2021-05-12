import React from 'react';
import logo from './logo.svg';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import * as antd from 'antd';
import { AppContext } from '../AppContext';

const { Header, Sider, Content } = antd.Layout;

export default interface Menu {
  key: string;
  title: string;
  component: JSX.Element;
  icon: JSX.Element;
}

interface MainPageProps {
  menus: Menu[];
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
}

const MainPage = ({ menus, title, icon, content }: MainPageProps) => {
  const appCtx = React.useContext(AppContext);
  console.table(menus);
  return (
    <antd.Layout>
      <Sider trigger={null} collapsible collapsed={appCtx.collapsed}>
        <div className="logo" />
        <antd.Menu
          mode="inline"
          className="vh-100"
          selectedKeys={['/' + window.location.hash.slice(2)]}
          onClick={({ item, key }) => (window.location.href = `/#${key}`)}
        >
          {menus.map((menu) => (
            <antd.Menu.Item key={menu.key} icon={menu.icon}>
              {menu.title}
            </antd.Menu.Item>
          ))}
        </antd.Menu>
      </Sider>
      <antd.Layout className="site-layout">
        <Header className="site-layout-background" style={{ paddingLeft: 20 }}>
          {React.createElement(appCtx.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => {
              appCtx.onCollapse(!appCtx.collapsed);
            },
          })}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '6px 10px',
            padding: 6,
          }}
        >
          {content}
        </Content>
      </antd.Layout>
    </antd.Layout>
  );
};

export { MainPage };
