'use client';
import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  message,
} from 'antd';
import { getUserDataByToken, registerAdmin, userLogin } from '@/services/auth-service';
import useAccessToken from '@/hooks/useAccessToken';
import { useDispatch } from 'react-redux';
import { IUserAccessData } from '@/types/user-types';
import { set_User_Data } from '@/redux/features/authData';

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

type props = {
  onSuccess: () => void;
}

const AdminProfile = ({onSuccess}:props) => {
  const dispatch = useDispatch();
  const { setSrvAccessToken, setSrvRefreshToken} = useAccessToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try{
      const res = await registerAdmin(values.name, values.email, values.password);
      message.loading("Creating profile", 2);
      const tokenRes = await userLogin(values.email, values.password);
      if(tokenRes.accessToken && tokenRes.refreshToken){
        setSrvAccessToken(tokenRes.accessToken);
        setSrvRefreshToken(tokenRes.refreshToken);
      }
      saveUserData(tokenRes.accessToken);
      onSuccess();
    }catch(err){
      message.error("Failed to create profile");
      console.log(err);
    }
    setLoading(false);
  };

  const saveUserData = async (token: string) => {
    try{
      const res = await getUserDataByToken(token).then((res) => res.data);
      const userData: IUserAccessData = {
        email: res.data.email,
        fullName: res.data.fullName,
        role: res.data.role,
        enabled: res.data.enabled,
        _id: res.data._id,
      }
      dispatch(set_User_Data(userData));
    }catch(err){
      console.log(err);
    }
  }
  
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column"}}>
      <Form
      // {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
      style={{ maxWidth: 600 }}
        scrollToFirstError
        size='large'
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
          >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
          >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminProfile;