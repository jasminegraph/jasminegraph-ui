'use client';
import React from "react";
import { Space, Table, Tag, Button, Popconfirm } from "antd";
import type { TableProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface DataType {
  key: string;
  name: string;
  type: string;
  vertexCount: number;
  edgeCount: number;
  status: boolean;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Graph Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Vertex Count',
    dataIndex: 'vertexCount',
    key: 'vertexCount',
  },
  {
    title: 'Edge Count',
    dataIndex: 'edgeCount',
    key: 'edgeCount',
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
    title: 'Delete',
    key: 'delete',
    render: (_: any, record: DataType) => (
      <Popconfirm
        title="Delete Graph"
        description="Are you sure want to delete this graph?"
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      >
        <Button danger>Delete</Button>
      </Popconfirm>
    ),
  }
];

const items: DataType[] = [
  {
    key: '1',
    name: 'Social Network',
    type: 'Undirected',
    vertexCount: 100,
    edgeCount: 1000,
    status: true,
  },
  {
    key: '2',
    name: 'Web Graph',
    type: 'Directed',
    vertexCount: 1000,
    edgeCount: 10000,
    status: true,
  },
  {
    key: '3',
    name: 'Knowledge Graph',
    type: 'Undirected',
    vertexCount: 10000,
    edgeCount: 100000,
    status: false,
  },
];

export default function GraphDetails() {
  return (
    <div style={{marginTop: "20px"}}>
      <Table columns={columns} dataSource={items} />
    </div>
  );
}
