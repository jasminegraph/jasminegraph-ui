'use client';
import React from 'react'
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="flex justify-center items-center" style={{height: "100vh"}}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={()=> router.replace("/")}>Back Home</Button>}
      />
    </div>
  )
}