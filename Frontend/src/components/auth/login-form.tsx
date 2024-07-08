'use client';
import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { userLogin } from '@/services/auth-service';
import { set_Is_User_Authenticated } from '@/redux/features/authData';
import { useRouter } from 'next/navigation';

type FieldType = {
  username?: string;
  password?: string;
};

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const {username, password} = values;
    try{
      if(username && password){
        const response = await userLogin(username, password);
        if('data' in response){
          dispatch(set_Is_User_Authenticated(true));
        }
        router.push('/clusters')
      }
    }catch(err: any){
      message.warning(err?.data?.message)
    }
  }

  return (
    <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Login
      </Button>
    </Form.Item>
  </Form>
  )
}

export default LoginForm