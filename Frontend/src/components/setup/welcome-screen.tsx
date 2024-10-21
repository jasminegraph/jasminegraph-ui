'use client';
import React from 'react';
import { Button } from 'antd';

type props = {
  onSuccess: () => void;
}

const WelcomeScreen = ({onSuccess}:props) => {
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column"}}>
      <h1>Welcome to the Setup Wizard</h1>
      <p style={{marginBottom: "40px"}}>Follow the steps to get started</p>
      <Button type="primary" onClick={onSuccess}>
        Next
      </Button>
    </div>
  )
}

export default WelcomeScreen;