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
