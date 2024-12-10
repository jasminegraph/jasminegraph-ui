'use client';
import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
} from 'antd';
import { addNewCluster } from '@/services/cluster-service';
import useAccessToken from '@/hooks/useAccessToken';

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
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const { getSrvAccessToken } = useAccessToken();
  const onFinish = async (values: any) => {
    setLoading(true);
    try{
      const res = await addNewCluster(values.name, values.description, values.host, values.port, getSrvAccessToken());
      onSuccess();
    }catch(err){
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column"}}>
      <Form
      // {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{}}
      style={{ maxWidth: 600 }}
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
          <Button type="primary" htmlType="submit" loading={loading}>
            add default cluster
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ClusterSetup;