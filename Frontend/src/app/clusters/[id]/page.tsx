'use client';
import React, { useEffect, useState } from "react";
import { Descriptions, Input, Row, Col, Divider } from 'antd';
import type { DescriptionsProps } from 'antd';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { IClusterDetails } from "@/types/cluster-types";
import { useAppSelector } from "@/redux/hook";
import { useDispatch } from "react-redux";
import { set_Selected_Cluster } from "@/redux/features/clusterData";
import { getCluster } from "@/services/cluster-service";

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

export default function ClusterDetails({ params }: { params: { id: string } }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedCluster } = useAppSelector(state => state.clusterData)
  const [clusterDetails, setClusterDetails] = useState<IClusterDetails | null>(selectedCluster);

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Cluster ID',
      children: clusterDetails?._id || "",
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

  const fetchClusterDetails = async () => {
    try{
      const res = await getCluster(params.id);
      if(res.data){
        setClusterDetails(res.data)
      }
      dispatch(set_Selected_Cluster(res.data))
    }catch(err){
      console.log("Failed to fetch cluster")
    }
  }

  useEffect(()=> {
    if (clusterDetails == null || selectedCluster == null){
      fetchClusterDetails()
    }
  }, [params])

  const getNodeData = () => {
    return undefined;
  }

  const filterMasterNodeData = (nodes: DataType[] | undefined) => {
    return nodes?.filter((node) => node.Role === "Master");
  }

  const filterWorkerNodeData = (nodes: DataType[] | undefined) => {
    return nodes?.filter((node) => node.Role === "Worker");
  }

  return (
    <div className="">
      <Row style={{justifyContent: "space-between", marginTop: "20px"}}>
        <Col span={10}>
        <h1 style={{fontSize: "xx-large", fontWeight: "600", lineHeight: "1.5", marginBottom: "20px"}}>Default Cluster</h1>
        <TextArea rows={4} placeholder="cluster description" maxLength={6} value={clusterDetails?.description} />
        </Col>
        <Col span={12}>
          <Descriptions title="Cluster Information" items={items} column={1} />
        </Col>
      </Row>
      <Divider>Master Nodes</Divider>
      <Table columns={columns} dataSource={filterMasterNodeData(getNodeData())} pagination={false} />
      <Divider>Worker Nodes</Divider>
      <Table columns={columns} dataSource={filterWorkerNodeData(getNodeData())} pagination={false} />
    </div>
  );
}