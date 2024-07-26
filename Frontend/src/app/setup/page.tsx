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
    content: <WelcomeScreen />,
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
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default Setup;