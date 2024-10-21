'use client';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const FinishStep = () => {
  const router = useRouter();

  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column"}}>
        <Result
    status="success"
    title="Profile Creation Completed"
    subTitle="Your profile has been successfully created."
    extra={[
      <Button type="primary" key="console" onClick={()=> {
        router.replace("/")
      }}>
        Let&apos;s Start
      </Button>,
    ]}
  />
    </div>
  );
}

export default FinishStep;