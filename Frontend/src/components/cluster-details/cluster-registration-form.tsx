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

import React, { useState } from 'react';
import type { CascaderProps } from 'antd';
import {
  Button,
  Form,
  Input,
  message,
  Select,
} from 'antd';
import { USER_ROLES } from '@/data/user-data';
import { registerUser } from '@/services/auth-service';
import { addNewCluster } from '@/services/cluster-service';

const { Option } = Select;

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

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

const ClusterRegistrationForm = ({onSuccess}: props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try{
      const res = await addNewCluster(values.name, values.description, values.host, values.port);
      message.loading("Connecting New Cluster", 2);
      onSuccess();
    }catch(err){
      message.error("Failed to add cluster");
    }
    setLoading(false);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Cluster Name"
        tooltip="Enter your username. Keep it simple and recognizable."
        rules={[{ required: true, message: 'Please input your cluster name!', whitespace: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <Input />
      </Form.Item>

      <Form.Item 
        name="host"
        label="Host"
      >
        <Input />
      </Form.Item>

      <Form.Item 
        name="port"
        label="Port"
      >
        <Input />
      </Form.Item>
      
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Connect
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClusterRegistrationForm;
