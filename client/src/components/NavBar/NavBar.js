import React, { useState } from 'react';
import {
  CompassOutlined,
  HomeFilled,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Home', '1', <HomeFilled />),
  getItem('Search', '2', <SearchOutlined />),
  getItem('Explore', '3', <CompassOutlined />),
  getItem('Profile', '5', <UserOutlined />),
  getItem('More', '6', <MenuOutlined />),
];


const NavBar = ()=>{
    const [collapsed, setCollapsed] = useState(false);
    return (
        <>
             <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <h4  style={{color: 'whitesmoke',paddingLeft: '50px'}}>AuraVerse</h4>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
        </>
    );
}

export default NavBar;