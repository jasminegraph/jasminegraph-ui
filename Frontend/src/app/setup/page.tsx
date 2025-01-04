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
import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import WelcomeScreen from '@/components/setup/welcome-screen';
import AdminProfile from '@/components/setup/admin-profile';
import ClusterSetup from '@/components/setup/cluster-profile';
import FinishStep from '@/components/setup/last-step';

const Setup = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  
const steps = [
  {
    title: 'Welcome',
    content: <WelcomeScreen onSuccess={next}/>,
  },
  {
    title: 'Admin Profile',
    content: <AdminProfile onSuccess={next}/>,
  },
  {
    title: 'Cluster Setup',
    content: <ClusterSetup onSuccess={next}/>,
  },
  {
    title: 'Done',
    content: <FinishStep />,
  },
];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    height: "75vh"
  };

  return (
    <div style={{margin: "30px"}}>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
    </div>
  );
};

export default Setup;
