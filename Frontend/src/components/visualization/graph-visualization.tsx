/**
Copyright 2025 JasminGraph Team
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
import { getGraphVizualization } from '@/services/graph-visualiztion';
import { Button, Progress, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import { LoadingOutlined } from '@ant-design/icons';

import 'vis-network/styles/vis-network.css';
import { delay } from '@/utils/time';

const DEFAULT_TIMEOUT = 75;

export type INode = {
  id: number;
  label: string;
  shape: string;
  color: string;
}

type IEdge = {
  from: number;
  to: number;
}

type Props = {
  graphID: any;
}

const GraphVisualization = ({graphID}:Props) => {
  const [loading, setLoading] = React.useState(false);
  const [progressing, setProgressing] = React.useState(false);
  const [percent, setPercent] = React.useState<number>(0);
  const [graph, setGraph] = React.useState<any>(null);
  const networkContainerRef = useRef(null); // Reference for the container
  const nodesRef = useRef<any>(null);
  const edgesRef = useRef<any>(null);
  
  const getGraph = async () => {
    try{
      setLoading(true);
      const res = await getGraphVizualization(graphID);
      setLoading(false);
      setPercent(0);
      setProgressing(true);
      
      if(res.data){
        const newNodes: INode[] = res.data.nodes ?? [];
        const newEdges: IEdge[] = res.data.edges ?? [];
        const nodeCount = newNodes.length

        newEdges.forEach((edge, index) => edgesRef.current.add(edge));  
        for (let index = 0; index < newNodes.length; index++) {
          const node = newNodes[index];
          nodesRef.current.add(node);
          await delay(DEFAULT_TIMEOUT);
          setPercent(Math.ceil((index/nodeCount)*100))
        }
        
      }
      return res;
    }catch(err){
      console.log("error while getting graph data: ", err);
      setLoading(false);
    }
  }
  
  const onViewGraph = async (key: string) => {
    const graph = await getGraph();
    setGraph(graph);
  }

  useEffect(() => {
    onViewGraph(graphID)
  }, [graphID])

  useEffect(() => {
    if (!networkContainerRef.current) return;

    // Sample nodes and edges (you can dynamically fetch these from the backend)
    nodesRef.current = new DataSet([]);

    edgesRef.current = new DataSet([]);

    // Graph options
    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: {
          size: 15,
        },
        color: {
          border: '#2B7CE9',
          background: '#97C2FC',
        },
      },
      edges: {
        color: {
          color: '#848484',
          highlight: '#848484',
          hover: '#848484',
        },
        width: 2,
      },
      // physics: {
      //   enabled: true,
      // },
    };

    // Initialize the network
    const network = new Network(networkContainerRef.current, { nodes: nodesRef.current, edges: edgesRef.current }, options);

    return () => {
      // Cleanup on component unmount
      network.destroy();
    };
  }, []);

  return (
    <div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
      <div
        ref={networkContainerRef}
        style={{
          width: '100%',
          height: '600px',
          border: '1px solid lightgray',
          backgroundColor: '#ffffff',
        }}
      ></div>
      {progressing && <Progress percent={percent} showInfo={false} />}
    </div>
  );
};

export default GraphVisualization;
