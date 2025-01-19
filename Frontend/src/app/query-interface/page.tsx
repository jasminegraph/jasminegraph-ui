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
import React, { useState, useEffect }  from "react";
import { Input, message, Table, Tabs } from 'antd';
import type { TabsProps } from "antd";
import { DownloadOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_query_result, clear_result } from "@/redux/features/queryData";
import { Select, Space } from 'antd';
import { getGraphList } from "@/services/graph-service";
import { DataType } from "../graph-panel/graph/page";
import QueryVisualization from "@/components/visualization/query-visualization";

type TabItem = Required<TabsProps>['items'][number];

const { TextArea } = Input;

const WS_URL = "ws://localhost:8080";

export default function Query() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket>();
  const [clientID, setClientID] = useState<string>('');

  const { messagePool } = useAppSelector((state) => state.queryData);

  const [selectedGraph, setSelectedGraph] = React.useState<any>();
  const [graphs, setGraphs] = React.useState<any[]>([]);

  const getGraphsData = async () => {
    try{
    const res = await getGraphList();
    console.log(res)
    if(res.data){
      const filteredData: DataType[] = res.data.map((graph: any) => {
        return {
          value: graph.idgraph,
          label: graph.name,
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

  const handleChange = (value: string) => {
    setSelectedGraph(value);
  };

  const initSocket = async () => {
    if(socket?.CLOSED || !socket){
      try {
        const socket = new WebSocket(WS_URL);
        socket.onopen = () => {};
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log(message)
          if(message?.type == "CONNECTED"){
            setClientID(message?.clientId)
          }else{
            dispatch(add_query_result(message));
          }
        };
        socket.onclose = () => {
          console.log("disconnected");
        };
        setSocket(socket);
      } catch (err) {
        console.log("Error connecting to messaging server");
      }
    }
  };

  const onQuerySubmit = async () => {
    try{
      setLoading(true);
      dispatch(clear_result());
      await initSocket()
      if (socket?.readyState === WebSocket.OPEN){
        socket?.send(
          JSON.stringify({
            type: "QUERY",
            query,
            graphId: selectedGraph,
            clientId: clientID,
            clusterId: localStorage.getItem("selectedCluster")
          })
        );
      }    
    }catch (err){
      console.log("ERROR::", err)
    }finally{
      setLoading(false)
    }
  }

  // Keys that must always be first
  const fixedKeys = ["id", "type", "name"];

  // Get all unique keys from the data
  const allKeys = Array.from(
    new Set(messagePool.flatMap((item) => Object.keys(item)))
  );

  // Separate dynamic keys (excluding fixed ones)
  const dynamicKeys = allKeys.filter((key) => !fixedKeys.includes(key));
  
  // Define columns, placing fixed keys first
  const columns = [
    ...fixedKeys.map((key) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key: key,
    })),
    ...dynamicKeys.map((key) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key: key,
    })),
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  const tabItems: TabItem[] = [
    {
      key: '1',
      label: 'Table View',
      children: <>
          <Table
          dataSource={messagePool}
          columns={columns}
          rowKey="id" // Use 'id' as the unique row identifier
          pagination={{ pageSize: 20 }}
          scroll={{ y: 70 * 5 }}
          size="small"
        />
      </>,
    },
    {
      key: '2',
      label: 'Graph View',
      children: <div style={{width: "80%"}}>
        <QueryVisualization />
      </div>
    }
  ]

  return (
    <div className="">
      <div style={{display: "flex", justifyContent: "space-between", width: "100%", border: "1px solid #d9d9d9", borderRadius: "8px", padding: "10px", margin: "15px 0px", gap: "10px"}}>
        <Select
            placeholder={'Graph'}
            style={{ width: 120 }}
            onChange={handleChange}
            value={selectedGraph}
            options={graphs}
            size="large"
          />
        <div style={{width: "90%"}}>
          <TextArea 
            placeholder="Query ..." 
            onChange={(e) => setQuery(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 7 }}
            size="large"
          />
        </div>
        <CaretRightOutlined style={{fontSize: "24px", margin: "2px", padding: "0px 10px"}} onClick={onQuerySubmit}/>
        {/* <DownloadOutlined style={{fontSize: "20px", margin: "2px"}} /> */}
      </div>
      {messagePool.length > 0 && (
        <Tabs
          onChange={onChange}
          type="card"
          items={tabItems}
        />
      )}
    </div>
  );
}
