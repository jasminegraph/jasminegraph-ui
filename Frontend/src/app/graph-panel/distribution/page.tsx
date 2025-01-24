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
import type { CollapseProps } from 'antd';
import { Button, Collapse, message, Modal, Spin } from 'antd';
import { getGraphVizualization } from "@/services/graph-visualiztion";
import { LoadingOutlined } from '@ant-design/icons';
import GraphVisualization from "@/components/visualization/graph-visualization";
import { Select, Space } from 'antd';
import { getGraphList } from "@/services/graph-service";
import { DataType } from "../graph/page";

const text = `
  Graphs' details (size, last_modified, nodes, edges)
`;

export default function GraphDistribution() {
  const [selectedGraph, setSelectedGraph] = React.useState<any>();
  const [graphs, setGraphs] = React.useState<any[]>([]);

  const getGraphsData = async () => {
    try{
    const res = await getGraphList();
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

  return (
    <div className="">
      <div style={{margin: "20px 0px", width: "80%"}}>
        <h1 style={{fontSize: "xx-large", fontWeight: "600", lineHeight: "1.5"}}>Graph Visualization</h1>
        <p>This page allows users to explore and analyze graph datasets interactively. 
          Nodes and edges are displayed dynamically, showing relationships and connections 
          within the data. Users can load different datasets, view updates in real-time, 
          and interact with the graph by zooming and repositioning nodes
        </p>
      </div>
      <div style={{width: "80%"}}>
        <div style={{display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px"}}>
          <div>Select Graph:</div>
          <Select
            style={{ width: 120 }}
            onChange={handleChange}
            value={selectedGraph}
            options={graphs}
            size="large"
          />
        </div>
        {selectedGraph && <GraphVisualization graphID={selectedGraph} />}
      </div>
    </div>
  );
}
