/**
Copyright 2024 JasmineGraph Team
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
import React, { useState, useEffect } from "react";
import { Button, message, Select } from 'antd';
import GraphVisualization from "@/components/visualization/graph-visualization";
import { getGraphList } from "@/services/graph-service";
import InDegreeVisualization from "@/components/visualization/indegree-visualization";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GRAPH_TYPES, GRAPH_VISUALIZATION_TYPE, GraphType, GraphVisualizationType } from "@/data/graph-data";
import { add_degree_data, clear_degree_data, add_visualize_data, clear_visualize_data } from "@/redux/features/queryData";
import { useAppDispatch } from "@/redux/hook";
import { IOption } from "@/types/options-types";
import { IGraphDetails } from "@/types/graph-types";
import TwoLevelGraphVisualization from "@/components/visualization/two-level-graph-visualization";

const WS_URL = "ws://localhost:8080";

type ISocketResponse = {
  type: string,
  clientId?: string
}

const ListResponse = [
  {
    "centralpartitioncount": 4,
    "edgecount": 6594,
    "idgraph": 1,
    "name": "sample1",
    "partitions": [
      {
        "central_edgecount": 8,
        "central_edgecount_with_dups": 17,
        "central_vertexcount": 8,
        "edgecount": 1577,
        "idpartition": 0,
        "vertexcount": 1212
      },
      {
        "central_edgecount": 15,
        "central_edgecount_with_dups": 22,
        "central_vertexcount": 15,
        "edgecount": 1477,
        "idpartition": 1,
        "vertexcount": 1213
      },
      {
        "central_edgecount": 11,
        "central_edgecount_with_dups": 21,
        "central_vertexcount": 11,
        "edgecount": 1792,
        "idpartition": 2,
        "vertexcount": 1268
      },
      {
        "central_edgecount": 9,
        "central_edgecount_with_dups": 26,
        "central_vertexcount": 9,
        "edgecount": 1705,
        "idpartition": 3,
        "vertexcount": 1248
      }
    ],
    "status": "op",
    "upload_path": "/var/tmp/powergrid1.dl",
    "vertexcount": 4941
  },
  {
    "centralpartitioncount": 4,
    "edgecount": 6594,
    "idgraph": 2,
    "name": "sample2",
    "partitions": [
      {
        "central_edgecount": 8,
        "central_edgecount_with_dups": 17,
        "central_vertexcount": 8,
        "edgecount": 1577,
        "idpartition": 0,
        "vertexcount": 1212
      },
      {
        "central_edgecount": 15,
        "central_edgecount_with_dups": 22,
        "central_vertexcount": 15,
        "edgecount": 1477,
        "idpartition": 1,
        "vertexcount": 1213
      },
      {
        "central_edgecount": 11,
        "central_edgecount_with_dups": 21,
        "central_vertexcount": 11,
        "edgecount": 1792,
        "idpartition": 2,
        "vertexcount": 1268
      },
      {
        "central_edgecount": 9,
        "central_edgecount_with_dups": 26,
        "central_vertexcount": 9,
        "edgecount": 1705,
        "idpartition": 3,
        "vertexcount": 1248
      }
    ],
    "status": "op",
    "upload_path": "/var/tmp/powergrid2.dl",
    "vertexcount": 4941
  },
  {
    "centralpartitioncount": 4,
    "edgecount": 6594,
    "idgraph": 3,
    "name": "sample3",
    "partitions": [
      {
        "central_edgecount": 8,
        "central_edgecount_with_dups": 17,
        "central_vertexcount": 8,
        "edgecount": 1577,
        "idpartition": 0,
        "vertexcount": 1212
      },
      {
        "central_edgecount": 15,
        "central_edgecount_with_dups": 22,
        "central_vertexcount": 15,
        "edgecount": 1477,
        "idpartition": 1,
        "vertexcount": 1213
      },
      {
        "central_edgecount": 11,
        "central_edgecount_with_dups": 21,
        "central_vertexcount": 11,
        "edgecount": 1792,
        "idpartition": 2,
        "vertexcount": 1268
      },
      {
        "central_edgecount": 9,
        "central_edgecount_with_dups": 26,
        "central_vertexcount": 9,
        "edgecount": 1705,
        "idpartition": 3,
        "vertexcount": 1248
      }
    ],
    "status": "op",
    "upload_path": "/var/tmp/powergrid3.dl",
    "vertexcount": 4941
  },
  {
    "centralpartitioncount": 4,
    "edgecount": 6594,
    "idgraph": 4,
    "name": "sample4",
    "partitions": [
      {
        "central_edgecount": 8,
        "central_edgecount_with_dups": 17,
        "central_vertexcount": 8,
        "edgecount": 1577,
        "idpartition": 0,
        "vertexcount": 1212
      },
      {
        "central_edgecount": 15,
        "central_edgecount_with_dups": 22,
        "central_vertexcount": 15,
        "edgecount": 1477,
        "idpartition": 1,
        "vertexcount": 1213
      },
      {
        "central_edgecount": 11,
        "central_edgecount_with_dups": 21,
        "central_vertexcount": 11,
        "edgecount": 1792,
        "idpartition": 2,
        "vertexcount": 1268
      },
      {
        "central_edgecount": 9,
        "central_edgecount_with_dups": 26,
        "central_vertexcount": 9,
        "edgecount": 1705,
        "idpartition": 3,
        "vertexcount": 1248
      }
    ],
    "status": "op",
    "upload_path": "/var/tmp/powergrid4.dl",
    "vertexcount": 4941
  },
  {
    "centralpartitioncount": 4,
    "edgecount": 6594,
    "idgraph": 5,
    "name": "test-data",
    "partitions": [
      {
        "central_edgecount": 8,
        "central_edgecount_with_dups": 17,
        "central_vertexcount": 8,
        "edgecount": 1577,
        "idpartition": 0,
        "vertexcount": 1212
      },
      {
        "central_edgecount": 15,
        "central_edgecount_with_dups": 22,
        "central_vertexcount": 15,
        "edgecount": 1477,
        "idpartition": 1,
        "vertexcount": 1213
      },
      {
        "central_edgecount": 11,
        "central_edgecount_with_dups": 21,
        "central_vertexcount": 11,
        "edgecount": 1792,
        "idpartition": 2,
        "vertexcount": 1268
      },
      {
        "central_edgecount": 9,
        "central_edgecount_with_dups": 26,
        "central_vertexcount": 9,
        "edgecount": 1705,
        "idpartition": 3,
        "vertexcount": 1248
      }
    ],
    "status": "op",
    "upload_path": "/var/tmp/powergrid5.dl",
    "vertexcount": 4941
  }
];

export default function GraphDistribution() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [graphs, setGraphs] = useState<IGraphDetails[]>([]);
  const [graphOptions, setGraphOptions] = useState<IOption[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<string | undefined>(undefined);
  const [visualizationType, setVisualizationType] = useState<GraphVisualizationType | undefined>(undefined);
  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(WS_URL, { shouldReconnect: (closeEvent) => true });  
  const [clientId, setClientID] = useState<string>('')
  const [isVisualize, setIsVisualize] = useState<boolean>(false);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const getGraphsData = async () => {
    try{
    // const res = await getGraphList();
    const res = {
      data: ListResponse
    };
    if(res.data){
      const filteredData: IOption[] = res.data.map((graph: any) => {
        return {
          value: graph.idgraph,
          label: graph.name,
        }
      })
      setGraphOptions(filteredData)
      setGraphs(res.data);
    }
    }catch(err){
      message.error("Failed to fetch graphs: " + err);
    }
  }

  useEffect(() => {
    getGraphsData();
  }, []);

  useEffect(() => {
    console.log("GRAPG OPTION", graphOptions);
    console.log("GRAPHS",graphs);
  }, [graphOptions, graphs])

  const handleChange = (value: string) => {
    setSelectedGraph(value);
  };

  const handleVisualizationTypeChange = (value: GraphVisualizationType) => {
    setVisualizationType(value);
  }

  useEffect(() => {
    const message = lastJsonMessage as ISocketResponse;
    if(!message) return;
    if(message?.type == "CONNECTED"){
      setClientID(message?.clientId || '')
    }else if (Object.values(GRAPH_TYPES).includes(message.type as GraphType)) {
      dispatch(add_degree_data({data: message, type: message?.type as GraphType}));
    } else {
      dispatch(add_visualize_data({ ...message}));
    }
  }, [lastJsonMessage]) 

  const onDegreeQuerySubmit = async () => {
    if(!visualizationType){
      message.info("Please Select Graph Visualization Type")
      return
    }
    try{
      setLoading(true);
      dispatch(clear_degree_data(visualizationType as GraphType));
      if (readyState === ReadyState.OPEN){
        sendJsonMessage(
          {
            type: "GRAPH_DEGREE",
            degree_type: visualizationType as GraphType,
            graphId: selectedGraph,
            clientId: clientId,
            clusterId: localStorage.getItem("selectedCluster")
          }
        );
      }    
    }catch (err){
      console.log("ERROR::", err)
    }finally{
      setLoading(false)
    }
  }

  const onPartitionDetailsView = async (partitionID: number | null | undefined) => {
    if(partitionID){
      try{
        setLoading(true);
        dispatch(clear_visualize_data());
        if (readyState === ReadyState.OPEN){
          sendJsonMessage(
            {
              type: "QUERY",
              query: `match (n)-[r]-(m) where n.partitionID = ${partitionID} AND m.partitionID = ${partitionID} AND n.id < 10 return n,m`,
              graphId: 10,
              clientId: clientId,
              clusterId: localStorage.getItem("selectedCluster"),            
            }
          );
        }    
      }catch (err){
        console.log("ERROR::", err)
      }finally{
        setLoading(false)
      }
    }
  }

  const onVisualize = async () => {
    if(Object.values(GRAPH_TYPES).includes(visualizationType as GraphType)){
      setIsVisualize(false);
      onDegreeQuerySubmit();
    }else{
      setIsVisualize(true);
    }
  }

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
        <div style={{ display: "flex", gap: "30px" }}>
          <div style={{display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px"}}>
            <div>Select Graph:</div>
            <Select
              style={{ width: 120 }}
              onChange={handleChange}
              value={selectedGraph}
              options={graphOptions}
              size="large"
            />
          </div>
          <div style={{display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px"}}>
            <div>Visualization Type:</div>
            <Select
              style={{ width: 160 }}
              onChange={handleVisualizationTypeChange}
              value={visualizationType}
              options={[...GRAPH_VISUALIZATION_TYPE]}
              size="large"
            />
          </div>
          <div style={{display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px"}}>
            <Button
              type="primary"
              size="large"
              disabled={!(selectedGraph && visualizationType)}
              loading={loading}
              onClick={onVisualize}
            >
              Visualize
            </Button>
          </div>
        </div>
        {selectedGraph && isVisualize && (visualizationType=="full_view") && (
          <TwoLevelGraphVisualization 
            graphID={selectedGraph} 
            graph={graphs.find((graph) => graph.idgraph == selectedGraph)}
            onPartitionClick={onPartitionDetailsView} />
          )}
        {/* {selectedGraph && isVisualize && (visualizationType=="full_view") && <GraphVisualization graphID={selectedGraph}/>} */}
        {(selectedGraph && (visualizationType=="in_degree" || visualizationType=="out_degree")) && 
          (<InDegreeVisualization loading={loading} degree={visualizationType} />)}
      </div>
    </div>
  );
}
