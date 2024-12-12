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
import React, { useEffect } from "react";
import { Space, Table, Tag, Button, Popconfirm, message } from "antd";
import type { TableProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getGraphList, deleteGraph } from "@/services/graph-service";
export interface DataType {
  key: string;
  name: string;
  type: string;
  vertexCount: number;
  edgeCount: number;
  status: string;
}

export default function GraphDetails() {
  const [graphs, setGraphs] = React.useState<any[]>([]);

  const getGraphsData = async () => {
    try{
    const res = await getGraphList();
    if(res.data){
      const filteredData: DataType[] = res.data.map((graph: any) => {
        return {
          key: graph.idgraph,
          name: graph.name,
          type: graph.type,
          vertexCount: graph.vertexcount,
          edgeCount: graph.edgecount,
          status: graph.status,
        }
      })
      setGraphs(filteredData);
    }
    }catch(err){
      message.error("Failed to fetch graphs: " + err);
    }
  }

  useEffect(() => {
    getGraphsData();
  }, [])

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
          description={`Are you sure you want to delete this graph: ${record.key} ?`}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            try {
              await deleteGraph(record.key);
              message.success("Graph deleted successfully");
              getGraphsData();
            } catch (err) {
              message.error("Failed to delete graph");
            }
          }
        }
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    }
  ];

  return (
    <div style={{marginTop: "20px"}}>
      <Table columns={columns} dataSource={graphs} />
    </div>
  );
}
