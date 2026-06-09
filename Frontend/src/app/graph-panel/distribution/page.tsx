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
import React, { useState, useEffect, useMemo } from "react";
import {Button, message, Select, Slider, Spin} from 'antd';
import { getGraphList } from "@/services/graph-service";
import InDegreeVisualization from "@/components/visualization/indegree-visualization";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GRAPH_TYPES, GRAPH_VISUALIZATION_TYPE, GraphType, GraphVisualizationType } from "@/data/graph-data";
import { add_degree_data, clear_degree_data, add_visualize_data, clear_visualize_data } from "@/redux/features/queryData";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { IOption } from "@/types/options-types";
import { IGraphDetails } from "@/types/graph-types";
import dynamic from "next/dynamic";
const LowLevelGraphVisualization = dynamic(
  () => import("@/components/visualization/low-level-graph-visualization"),
  { ssr: false }
);
const TwoLevelGraphVisualization = dynamic(
    () => import("@/components/visualization/two-level-graph-visualization"),
    { ssr: false } // Important: disables server-side rendering
);
import {LoadingOutlined} from "@ant-design/icons";
import { useActivity } from "@/hooks/useActivity";

const WS_URL = typeof window !== 'undefined'
  ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:8080`
  : 'ws://localhost:8080';

const _normalizeEventTime = (edge: any): number | null => {
    const candidates = [edge?.eventTime, edge?.properties?.eventTime, edge?.timestamp, edge?.properties?.timestamp];
    for (const c of candidates) {
        if (c !== undefined && c !== null && c !== "") {
            const parsed = Number(c);
            if (Number.isFinite(parsed)) return parsed;
        }
    }
    return null;
};

const _formatServerTime = (timestamp: number) => new Date(timestamp).toLocaleString();

type ISocketResponse = {
  type: string,
  clientId?: string
}

export default function GraphDistribution() {
  const dispatch = useAppDispatch();
  const { reportErrorFromException } = useActivity();
  const [loading, setLoading] = useState<boolean>(false);
  const [graphs, setGraphs] = useState<IGraphDetails[]>([]);
  const [graphOptions, setGraphOptions] = useState<IOption[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<string | undefined>(undefined);
  const [visualizationType, setVisualizationType] = useState<GraphVisualizationType | undefined>(undefined);
  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(WS_URL, { shouldReconnect: () => true, reconnectInterval: 1000, reconnectAttempts: Infinity });  
  const [clientId, setClientID] = useState<string>('')
  const [isVisualize, setIsVisualize] = useState<boolean>(false);
  const firstDataRowLogged = React.useRef(false);

  const lowLevelEdges = useAppSelector((state) => (state as any).queryData.visualizeData.edge);
  const serverTimes = useMemo(() => {
      const allTimes = (lowLevelEdges || [])
          .map((e: any) => _normalizeEventTime(e))
          .filter((t: any): t is number => t !== null)
          .sort((a: number, b: number) => a - b);
      return [...new Set(allTimes)] as number[];
  }, [lowLevelEdges]);
  const hasTemporalData = serverTimes.length > 0;
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
      if (!serverTimes.length) { setCurrentTimeIndex(0); setIsPlaying(false); return; }
      setCurrentTimeIndex(serverTimes.length - 1);
      setIsPlaying(false);
  }, [serverTimes]);

  useEffect(() => {
      if (!isPlaying || !serverTimes.length) return;
      if (currentTimeIndex >= serverTimes.length - 1) { setIsPlaying(false); return; }
      const timer = window.setInterval(() => {
          setCurrentTimeIndex((prev) => {
              const next = Math.min(prev + 1, serverTimes.length - 1);
              if (next >= serverTimes.length - 1) setIsPlaying(false);
              return next;
          });
      }, 600);
      return () => window.clearInterval(timer);
  }, [isPlaying, currentTimeIndex, serverTimes]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const getGraphsData = async () => {
    try{
        setLoading(true);
    const res = await getGraphList();
    if(res.data){
      const filteredData: IOption[] = res.data.map((graph: any) => {
        return {
            idgraph : graph.id,
          value: graph.idgraph,
          label: graph.idgraph + "|" + graph.name,
        }
      })
      setGraphOptions(filteredData)
      setGraphs(res.data);
    }
    }catch(err){
      message.error("Failed to fetch graphs: " + err);
      reportErrorFromException(
        "Graph Panel",
        err,
        "Failed to retrieve graph list from the server."
      );
    }finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    getGraphsData();
  }, []);

  const handleChange = (value: string) => {
    setSelectedGraph(value);
  };

  const handleVisualizationTypeChange = (value: GraphVisualizationType) => {
    setVisualizationType(value);
  }

  useEffect(() => {
    console.log('[WS] readyState changed:', connectionStatus);
  }, [readyState]);

  useEffect(() => {
    const message = lastJsonMessage as ISocketResponse;
    if(!message) return;
    const keys = Object.keys(message as object);
    console.log('[WS] message received — type:', (message as any)?.type, '| keys:', keys);
    if(message?.type == "CONNECTED"){
      console.log('[WS] CONNECTED, clientId:', message?.clientId);
      setClientID(message?.clientId || '')
    }else if (Object.values(GRAPH_TYPES).includes(message.type as GraphType)) {
      dispatch(add_degree_data({data: message, type: message?.type as GraphType}));
    } else {
      if ((message as any)?.done) {
        console.log('[WS] done signal received');
        firstDataRowLogged.current = false;
      } else if (!firstDataRowLogged.current) {
        firstDataRowLogged.current = true;
        console.log('[WS] first data row sample:', JSON.stringify(message));
      }
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
      console.error(err)
    }finally{
      setLoading(false)
    }
  }

  const onPartitionDetailsView = async (partitionID: number | null | undefined) => {
      try{
        setLoading(true);
        dispatch(clear_visualize_data());
        if (readyState === ReadyState.OPEN){
            const query = partitionID != null
              ? `match (n)-[r]-(m) where n.partitionID = ${partitionID} return n,m,r`
              : `match (n)-[r]-(m) return n,m,r`;

          console.log('[sendJsonMessage] QUERY graphId:', selectedGraph, '| clusterId:', localStorage.getItem('selectedCluster'), '| clientId:', clientId);
          sendJsonMessage(
            {
              type: "QUERY",
              query,
              graphId: selectedGraph,
              clientId: clientId,
              clusterId: localStorage.getItem("selectedCluster"),            
            }
          );
        } else {
          console.warn('[onPartitionDetailsView] WS not open, query NOT sent — readyState:', connectionStatus);
        }    
      }catch (err){
        console.error(err)
      }finally{
        setLoading(false)
      }
  }

  const onVisualize = async () => {
    console.log('[onVisualize] readyState:', connectionStatus, '| clientId:', clientId, '| graph:', selectedGraph, '| type:', visualizationType);
    if (readyState === ReadyState.CONNECTING) {
      message.info('WebSocket is connecting. Please try again in a moment.');
      return;
    }
    if (readyState !== ReadyState.OPEN) {
      message.error('WebSocket is not connected. Please refresh the page.');
      return;
    }
    if(Object.values(GRAPH_TYPES).includes(visualizationType as GraphType)){
      setIsVisualize(false);
      onDegreeQuerySubmit();
    }else{
      setIsVisualize(true);
      const selectedGraphDetails = graphs.find((graph: IGraphDetails) => String(graph.idgraph) === String(selectedGraph));
      const hasPartitionMetadata = Array.isArray(selectedGraphDetails?.partitions) && selectedGraphDetails!.partitions.length > 0;

      if (!hasPartitionMetadata && visualizationType === "full_view") {
        await onPartitionDetailsView(null);
      }
    }
  }

  return (
<>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
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
        <div style={{ display: "flex", alignItems: "center", gap: "30px", flexWrap: "nowrap" }}>
          <div style={{display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px", flexShrink: 0}}>
            <div>Select Graph:</div>
            <Select
              style={{ width: 120 }}
              onChange={handleChange}
              value={selectedGraph}
              options={graphOptions}
              size="large"
            />
          </div>
          <div style={{display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px", flexShrink: 0}}>
            <div>Visualization Type:</div>
            <Select
              style={{ width: 160 }}
              onChange={handleVisualizationTypeChange}
              value={visualizationType}
              options={[...GRAPH_VISUALIZATION_TYPE]}
              size="large"
            />
          </div>
          <div style={{display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px", flexShrink: 0}}>
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
          {isVisualize && hasTemporalData && (
            <div style={{display: "flex", alignItems: "center", marginBottom: "10px", gap: 10, flex: 1, minWidth: 0}}>
              <Button size="small" style={{flexShrink: 0}} onClick={() => setCurrentTimeIndex(0)}>Reset</Button>
              <Button size="small" type="primary" style={{flexShrink: 0}} onClick={() => setIsPlaying((p) => !p)}>
                {isPlaying ? "Pause" : "▶ Play"}
              </Button>
              <span style={{fontSize: 12, color: "#4a5580", whiteSpace: "nowrap", fontWeight: 500, flexShrink: 0}}>
                {_formatServerTime(serverTimes[currentTimeIndex])}
              </span>
              <div style={{flex: 1, minWidth: 0}}>
                <Slider
                  min={0}
                  max={Math.max(serverTimes.length - 1, 0)}
                  value={currentTimeIndex}
                  onChange={(value) => { setCurrentTimeIndex(Array.isArray(value) ? value[0] : value); setIsPlaying(false); }}
                  tooltip={{ formatter: (v) => _formatServerTime(serverTimes[typeof v === "number" ? v : 0] ?? serverTimes[0]) }}
                />
              </div>
            </div>
          )}
        </div>
        {selectedGraph && isVisualize && (visualizationType=="full_view") && (
          (() => {
            const selectedGraphDetails = graphs.find((graph: IGraphDetails) => String(graph.idgraph) === String(selectedGraph));
            const hasPartitionMetadata = Array.isArray(selectedGraphDetails?.partitions) && selectedGraphDetails.partitions.length > 0;

            if (!hasPartitionMetadata) {
              return <LowLevelGraphVisualization
                onHighLevelViewClick={async () => setIsVisualize(false)}
                serverTimes={serverTimes}
                currentTimeIndex={currentTimeIndex}
              />;
            }

            return (
              <TwoLevelGraphVisualization
                graphID={selectedGraph}
                graph={selectedGraphDetails}
                onPartitionClick={onPartitionDetailsView}
              />
            );
          })()
        )}
        {(selectedGraph && (visualizationType=="in_degree" || visualizationType=="out_degree")) && 
          (<InDegreeVisualization loading={loading} degree={visualizationType} />)}
      </div>
    </div>
</>
  );
}
