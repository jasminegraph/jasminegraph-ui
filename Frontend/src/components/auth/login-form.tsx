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
import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userLogin } from '@/services/auth-service';
import { set_Is_User_Authenticated } from '@/redux/features/authData';
import useAccessToken from '@/hooks/useAccessToken';

type FieldType = {
  username?: string;
  password?: string;
};

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setSrvAccessToken, setSrvRefreshToken } = useAccessToken();
  const [submitting, setSubmitting] = useState(false);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const { username, password } = values;
    try {
      if (username && password) {
        setSubmitting(true);
        const response = await userLogin(username, password);
        if (response && 'accessToken' in response && response.accessToken) {
          dispatch(set_Is_User_Authenticated(true));
          setSrvAccessToken(response.accessToken);
          setSrvRefreshToken(response.refreshToken);
          router.push('/clusters');
        } else if (response && 'message' in response) {
          message.error(response.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err: any) {
      message.warning(err?.data?.message || err?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Form
        name="login"
        layout="vertical"
        size="large"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item<FieldType>
          label={<span style={{ fontWeight: 500, color: '#374151' }}>Email</span>}
          name="username"
          rules={[
            { required: true, message: 'Please input your email address!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#9ca3af', marginRight: 6 }} />}
            placeholder="name@example.com"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item<FieldType>
          label={<span style={{ fontWeight: 500, color: '#374151' }}>Password</span>}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#9ca3af', marginRight: 6 }} />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            block
            style={{
              height: 44,
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              backgroundColor: '#1677ff',
              boxShadow: '0 2px 4px rgba(22, 119, 255, 0.2)',
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
        <span style={{ color: '#6b7280', fontSize: 14 }}>
          New to JasmineGraph?{' '}
        </span>
        <Link
          href="/setup"
          style={{
            color: '#1677ff',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Set up account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;

