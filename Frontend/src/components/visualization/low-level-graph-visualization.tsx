/**
Copyright 2025 JasmineGraph Team
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

import { Button, Card, message, Progress, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import { LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import 'vis-network/styles/vis-network.css';
import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import { useAppSelector } from '@/redux/hook';

export const ERROR_MSG = {
  noData: "No valid low-level graph data available for partition",
  failedMsg: "Failed to load low-level graph data."
}
export type INode = {
  id: number;
  label: string;
  shape: string;
  color: string;
  size?: number;
};

type IEdge = {
  from: number;
  to: number;
  properties?: any;
};

const networkOptions = {
  nodes: {
    shape: 'dot',
    size: 60,
    font: { size: 15 },
    color: { border: '#2B7CE9', background: '#97C2FC' },
  },
  edges: {
    color: { color: '#848484', highlight: '#848484', hover: '#848484' },
    width: 2,
  },
  autoResize: true,
};

type Props = {
  onHighLevelViewClick: () => void;
}

const LowLevelGraphVisualization = ({ onHighLevelViewClick }: Props) => {
  const [loading, setLoading] = useState(false);
  const [progressing, setProgressing] = useState(false);
  const [percent, setPercent] = useState<number>(0);
  const networkContainerRef = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const nodesRef = useRef<any>(new DataSet([]));
  const edgesRef = useRef<any>(new DataSet([]));

  const [selectedNode, setSelectedNode] = useState<number[] | null>(null);

  const lowLevelGraphData = useAppSelector((state) => state.queryData.visualizeData);

  const loadLowLevelView = async () => {
    try {
      setLoading(true);
      nodesRef.current.clear();
      edgesRef.current.clear();

      if (lowLevelGraphData && lowLevelGraphData.node && Array.isArray(lowLevelGraphData.edge)) {
        const { node, edge } = lowLevelGraphData;

        // Validate node format
        const validatedNodes = node.map((node: INode) => {
          return {
            ...node,
            id: node.id,
            label: node.label,
            shape: 'dot',
            color: '#97C2FC',
            size: 30,
            }
        });

        // Validate edge format
        const validatedEdges = edge.map((edge: IEdge) => {
          const isValid = edge.from !== undefined && edge.to !== undefined;
          if (!isValid) {
            console.warn('Invalid edge:', edge);
          }
          return { ...edge };
        });

        if (validatedNodes.length === 0) {
          message.warning('No valid nodes found for low-level view.');
        }

        edgesRef.current.add(validatedEdges);
        nodesRef.current.add(validatedNodes);

        if (network) {
          network.setData({ nodes: nodesRef.current, edges: edgesRef.current });
          network.fit(); // Ensure the view is adjusted
        }
      } else {
        console.warn(ERROR_MSG.noData, selectedNode);
        message.warning(ERROR_MSG.noData);
      }

      setLoading(false);
    } catch (err) {
      console.error(ERROR_MSG.failedMsg, err);
      message.error(ERROR_MSG.failedMsg);
      setLoading(false);
    }
  };

  const onViewGraph = async () => {
    if(nodesRef.current){
      nodesRef.current.clear();
    }
    if(edgesRef.current){
      edgesRef.current.clear();
    }
    await loadLowLevelView();
  };

  useEffect(() => {
    onViewGraph();
  }, [lowLevelGraphData]);

  useEffect(() => {
    if (!networkContainerRef.current) {
      console.error('Network container ref is not assigned');
      return;
    }

    const network = new Network(networkContainerRef.current, { nodes: nodesRef.current, edges: edgesRef.current }, networkOptions);

    network.on('selectNode', (params) => {
      setSelectedNode(params.nodes)
    });

    // Event listener for edge selection
    network.on('selectEdge', (params) => {
      const selectedEdges = params.edges;
      console.log('Selected Edges:', selectedEdges);
    });

    // Event listener for edge deselection
    network.on('deselectNode', (params) => {
      setSelectedNode(params.nodes);
    });

    setNetwork(network);

    return () => {
      network.destroy();
    };
  }, []);

  const getDetails = () => {
    const node = lowLevelGraphData.node.find((node: any) => selectedNode && node.id == selectedNode[0]);
    const keys = Object.keys(node);

    console.log("NODE DETAILS", node, keys);

    let items: DescriptionsProps['items'];
    
    if (node && node.id) {
      items = keys.map((key, index) => ({
        key: `${index + 1}`,
        label: key,
        children: `${node[key]}`,
      }));
    } else {
      items = [];
    }
    
    return items;
  }

  return (
    <div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
      <div 
        style={{
          position: 'relative',
          border: '1px solid red',
          height: '600px',
          aspectRatio: "16/9"
        }}
      >
        <div
          ref={networkContainerRef}
          style={{
            // width: '100%',
            height: '600px',
            border: '1px solid lightgray',
            backgroundColor: '#ffffff',
            aspectRatio: "16/9"
          }}
        />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px'
        }}>
          {selectedNode && selectedNode?.length > 0 && (
            <Card 
              style={{ maxWidth: 300 }}
            >
              <Descriptions column={1} title={`Node ${selectedNode}`}  items={getDetails()} />
            </Card>
          )}
        </div>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px'
        }}>
          <Button type="primary" icon={<LeftOutlined />} size={'large'} onClick={onHighLevelViewClick} />
        </div>
      </div>
      {progressing && <Progress percent={percent} showInfo={false} />}
    </div>
  );
};

export default LowLevelGraphVisualization;