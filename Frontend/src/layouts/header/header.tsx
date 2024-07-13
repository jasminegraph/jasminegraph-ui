'use client';
import React from 'react';
import { Layout, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { set_Is_User_Authenticated } from '@/redux/features/authData';

const { Header } = Layout;

const MainHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = () => {
    dispatch(set_Is_User_Authenticated(false));
    router.push("/auth");
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      danger: true,
      label: 'Logout',
      onClick: () => logout()
    },
  ];
  
  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
      <div style={{color: "white", fontSize: "x-large", fontWeight: "600"}} >
        JasmineGraph
      </div>
      <Dropdown menu={{ items }}>
        {/* <a onClick={(e) => e.preventDefault()}> */}
          <Space>
          <Avatar size="large" icon={<UserOutlined />} />
          </Space>
        {/* </a> */}
      </Dropdown>
      
    </Header>
  )
}

export default MainHeader;