'use client';
import React from 'react'
import LoginForm from '@/components/auth/login-form';

const Auth = () => {
  return (
      <div style={{height: "100vh", display: "flex", alignItems: "center"}}>
        <div style={{display: "flex", width: "60%", justifyContent: "center"}}>
          <p style={{fontSize: "80px", fontWeight: "500"}}>JasmineGraph</p>
        </div>
        <div style={{display: "flex", width: "40%", justifyContent: "flex-start"}}>
          <LoginForm />
        </div>
      </div>
  )
}

export default Auth;