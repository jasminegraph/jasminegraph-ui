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

'use client';
import React, { useEffect, useState } from "react";
import { Descriptions, Input, Row, Col, Divider, Button } from 'antd';
import type { DescriptionsProps } from 'antd';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { IClusterDetails } from "@/types/cluster-types";

interface DataType {
  key: string;
  nodeID: string;
  ipAddress: string;
  status: boolean;
  role: string;
  upTime: number;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'NodeID',
    dataIndex: 'nodeID',
    key: 'nodeID',
  },
  {
    title: 'IP Address',
    dataIndex: 'ipAddress',
    key: 'ip',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (_, { status }) => (
      <>
        {status ? (
          <Tag color={'green'}>
            {"Active"}
          </Tag>) : (
          <Tag color={"volcano"}>
            {"Inactive"}
          </Tag>
        )}
      </>
    ),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Uptime',
    dataIndex: 'upTime',
    key: 'uptime',
    render: (text) => <p>{text} days</p>
  }
];

const { TextArea } = Input;
const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Cluster ID',
    children: '6dc2ea20-9ea3-47cd-a5a9-25ac4b24c79e',
  },
  {
    key: '2',
    label: 'JasmineGraph Version',
    children: '1.21.101',
  },
  {
    key: '3',
    label: 'Platform',
    children: '-',
  },
];

export default function Instance({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [clusterDetails, setClusterDetails] = useState<IClusterDetails>();

  const getNodeData = () => {
    return [];
  }

  return (
    <div className="">
      <Row style={{justifyContent: "space-between", margin: "20px 0px"}}>
        <Col span={18}>
        <h1 style={{fontSize: "xx-large", fontWeight: "600", lineHeight: "1.5"}}>Node Details</h1>
        </Col>
      </Row>
      <Table columns={columns} dataSource={getNodeData()} pagination={false} />
    </div>
  );
}
