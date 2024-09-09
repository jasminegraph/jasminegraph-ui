'use client';
import React, { useEffect } from "react";
import { Space, Table, Tag, Button, Popconfirm, message } from "antd";
import type { TableProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getGraphList } from "@/services/graph-service";
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
        {status == 'op' ? (
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

export default function GraphDetails() {
  const [graphs, setGraphs] = React.useState<any[]>([]);

  const getGraphsData = async () => {
    try{
    const res = await getGraphList();
    console.log("::res::", res)
    if(res.data){
      const filteredData = res.data.map((graph: any) => {
        const data: DataType = {
          key: graph.idgraph,
          name: graph.name,
          type: graph.type,
          vertexCount: graph.vertexcount,
          edgeCount: graph.edgecount,
          status: graph.status,
        }
        setGraphs((prev) => [...prev, data]);
      })
    }
    console.log(filteredData)
    }catch(err){
      message.error("Failed to fetch graphs");
    }
  }

  useEffect(() => {
    getGraphsData();
  }, [])

  return (
    <div style={{marginTop: "20px"}}>
      <Table columns={columns} dataSource={graphs} />
    </div>
  );
}
