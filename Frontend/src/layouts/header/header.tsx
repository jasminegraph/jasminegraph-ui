/**
Copyright 2024 JasminGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

'use client';
import React from 'react';
import { Layout, Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { set_Is_User_Authenticated, set_Clear_User_Data } from '@/redux/features/authData';
import { useAppSelector } from '@/redux/hook';

const { Header } = Layout;

const MainHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData } = useAppSelector(state => state.authData)

  const logout = () => {
    dispatch(set_Is_User_Authenticated(false));
    dispatch(set_Clear_User_Data());
    localStorage.clear();
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
          <Space>
          <p style={{color: "white"}}>{userData.email}</p>
          <Avatar size="large" icon={<UserOutlined />} />
          </Space>
      </Dropdown>
      
    </Header>
  )
}

export default MainHeader;
