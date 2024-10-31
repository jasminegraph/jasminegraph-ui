'use client';
import React, { useEffect, useState } from 'react'
import LoginForm from '@/components/auth/login-form';
import { getAllUsers } from '@/services/user-service';
import { Alert, Button, message } from 'antd';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const router = useRouter();
  const [showSetupBackendAlert, setShowSetupBackendAlert] = useState<boolean>(false);

  const getUsers = async () => {
    try{
      const users = await getAllUsers();
      if (users && users.data.length == 0){
        setShowSetupBackendAlert(true);
      }
    }catch(err){
      message.error("Failed to ping backend");
    }
  }

  console.log("process.env.BACKEND", process.env.BACKEND);
  console.log("process.env.NEXT", process.env.NEXT_PUBLIC_API_URL);

  useEffect(()=> {
    getUsers();
  },[])

  return (
      <div style={{height: "100vh", display: "flex", alignItems: "center"}}>
        <div style={{display: "flex", width: "60%", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
          <p style={{fontSize: "80px", fontWeight: "500"}}>JasmineGraph</p>
          {showSetupBackendAlert && (
          <Alert  
            message="Admin User Not Found" 
            type="warning" 
            showIcon 
            closable 
            onClose={() => setShowSetupBackendAlert(false)} 
            style={{width: showSetupBackendAlert ? "60%" : "0%"}}
            action={
              <Button size="small" type="primary" onClick={() => {
                router.push("/setup")
              }}>
                Go to Setup
              </Button>
            }
            />
          )}
        </div>
        <div style={{display: "flex", width: "40%", justifyContent: "flex-start"}}>
          <LoginForm />
        </div>
      </div>
  )
}

export default Auth;