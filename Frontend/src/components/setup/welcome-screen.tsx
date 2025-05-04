/**
Copyright 2024 JasmineGraph Team
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
