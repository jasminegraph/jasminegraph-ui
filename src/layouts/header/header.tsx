import React from 'react';
import { Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

const { Header } = Layout;

const MainHeader = () => {
  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
      <div style={{color: "white", fontSize: "x-large", fontWeight: "600"}} >
        JasmineGraph
      </div>
      <Avatar size="large" icon={<UserOutlined />} />
    </Header>
  )
}

export default MainHeader;
