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
import React, { useState, useEffect }  from "react";
import { Input } from 'antd';
import { DownloadOutlined, CaretRightOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function Query() {
  const [value, setValue] = useState<string>('');

  return (
    <div className="">
      <div style={{display: "flex", justifyContent: "space-between", width: "100%", border: "1px solid #d9d9d9", borderRadius: "8px", padding: "10px", marginTop: "15px"}}>
        <div style={{width: "20px", margin: "2px"}}>
          $:
        </div>
        <div style={{width: "90%"}}>
          <TextArea 
            placeholder="Query ..." 
            onChange={(e) => setValue(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 7 }}
          />
        </div>
        <CaretRightOutlined style={{fontSize: "20px", margin: "2px"}} />
        <DownloadOutlined style={{fontSize: "20px", margin: "2px"}} />
      </div>
    </div>
  );
}
