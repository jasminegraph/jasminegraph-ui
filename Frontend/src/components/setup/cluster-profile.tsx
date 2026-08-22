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
import {
  Button,
  Form,
  Input,
  message,
} from 'antd';
import { useRouter } from 'next/navigation';
import { addNewCluster } from '@/services/cluster-service';
import useAccessToken from '@/hooks/useAccessToken';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

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

const ClusterSetup = ({onSuccess}:props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const { getSrvAccessToken } = useAccessToken();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const token = getSrvAccessToken() || "";
      const response = await addNewCluster(values.name, values.description, values.host, values.port, token);
      if ('errorCode' in response) {
        message.error(response.message);
      } else {
        onSuccess();
        form.resetFields();
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      message.error("An unexpected error occurred while adding the cluster.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", flexDirection: "column" }}>
      <div style={{ width: '100%', maxWidth: 540, margin: '0 auto' }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
            Cluster Setup
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Configure your default cluster now, or skip to access the dashboard
          </p>
        </div>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{}}
          style={{ width: '100%' }}
          scrollToFirstError
          size='large'
        >
          <Form.Item
            name="name"
            label="Cluster Name"
            rules={[
              {
                required: true,
                message: 'Please input valid cluster name',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="host"
            label="Host"
            rules={[
              {
                required: true,
                message: 'Please input host address',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="port"
            label="Port"
            rules={[
              {
                required: true,
                message: 'Please input port!',
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add Default Cluster
              </Button>
              <Button onClick={() => router.push('/clusters')}>
                Go to Dashboard
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ClusterSetup;
