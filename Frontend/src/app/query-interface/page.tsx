'use client';
import React, { useState, useEffect }  from "react";
import { Input } from 'antd';
import { DownloadOutlined, CaretRightOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function Query() {
  const [value, setValue] = useState<string>('');

  useEffect(()=> {
    console.log(value);
  }, [value]);

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
