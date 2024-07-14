'use client';
import React, { useEffect, useState } from "react";
import { Descriptions, Input, Row, Col, Divider, Button } from 'antd';
import type { DescriptionsProps } from 'antd';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { IClusterDetails } from "@/types/cluster-types";
import { ClusterData } from "@/data/cluster-data";

interface DataType {
  key: string;
  nodeID: string;
  IPaddress: string;
  Status: boolean;
  Role: string;
  UpTime: number;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'NodeID',
    dataIndex: 'nodeID',
    key: 'nodeID',
  },
  {
    title: 'IP Address',
    dataIndex: 'IPaddress',
    key: 'ip',
  },
  {
    title: 'Status',
    dataIndex: 'Status',
    key: 'status',
    render: (_, { Status }) => (
      <>
        {Status ? (
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
    dataIndex: 'Role',
    key: 'role',
  },
  {
    title: 'Uptime',
    dataIndex: 'UpTime',
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
    const nodeData: DataType[] | undefined = clusterDetails?.nodes.map((worker) => {
      return {
        key: worker.nodeID,
        nodeID: worker.nodeID,
        Status: worker.status,
        IPaddress: worker.IPaddress,
        Role: worker.role,
        UpTime: worker.upTime,
      }
    });
    return nodeData;
  }

  useEffect(()=>{
    const info = ClusterData.find((cluster) => cluster.clusterId === params.id);
    setClusterDetails(info);
    setLoading(false);
  },[params.id])

  return (
    <div className="">
      <Row style={{justifyContent: "space-between", margin: "20px 0px"}}>
        <Col span={18}>
        <h1 style={{fontSize: "xx-large", fontWeight: "600", lineHeight: "1.5"}}>Node Details</h1>
        <p>Manage cluster nodes and add new nodes.</p>
        </Col>
      </Row>
      <Table columns={columns} dataSource={getNodeData()} pagination={false} />
    </div>
  );
}