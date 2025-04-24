import { getGraphVizualization } from '@/services/graph-visualiztion';
import { Button, Progress, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import { LoadingOutlined } from '@ant-design/icons';
import 'vis-network/styles/vis-network.css';
import { delay } from '@/utils/time';
import { IGraphDetails } from '@/types/graph-types';

const DEFAULT_TIMEOUT = 75;

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

type Props = {
  graphID: any;
  graph: IGraphDetails | undefined;
};

const TwoLevelGraphVisualization = ({ graphID, graph }: Props) => {
  const [loading, setLoading] = useState(false);
  const [progressing, setProgressing] = useState(false);
  const [percent, setPercent] = useState<number>(0);
  const networkContainerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<any>(null);
  const edgesRef = useRef<any>(null);

  const getNodeSize = (partitionID: number, min: number, max: number): number => {
    const totalNodes = graph?.partitions.reduce((sum, partition) => sum + partition.vertexcount + partition.central_vertexcount, 0);
    const averageNodes = (totalNodes || 0) / (graph?.partitions.length || 1);
    const partitionNodes = graph?.partitions.find((partition) => partition.idpartition == partitionID)?.vertexcount;

     console.log("Total Nodes", totalNodes, averageNodes)
     if(partitionNodes && totalNodes)
      return min + (max-min)*(partitionNodes/totalNodes)
    return min;
  }

  const loadHighLevelEdgeList = () => {
    const partitionCount = graph?.partitions.length || 0;
    console.log("PARTITION COUNT", partitionCount)
    for (let i=0; i<partitionCount;i++){
      for(let j=i; j<partitionCount;i++){
        console.log(i,j)
      }
    }
  }

  // (0,1)
  // (0,2)
  // (0,3)
  // (0,4)

  // (1,2)
  // (1,3)
  // (1,4)

  // (2,3)
  // (2,4)

  // (3,4)

  const loadHighLevelView = async () => {
    try {
      setLoading(true);

      const nodes: INode[] = [];
      const edges: IEdge[] = [];

      nodes.forEach((node) => nodesRef.current.add(node));
      edges.forEach((edge) => edgesRef.current.add(edge));

      // Optionally, add nodes from graph.partitions
      graph?.partitions.forEach((partition) => {
        const node: INode = {
          id: partition.idpartition,
          label: partition.idpartition.toString(),
          shape: 'dot',
          color: '#97c2fc',
          size: 60,
        };
        nodesRef.current.add(node);
      });
    

      setLoading(false);
    } catch (err) {
      console.error('Error while getting graph data: ', err);
      setLoading(false);
    }
  };

  const onViewGraph = async () => {
    nodesRef.current.clear();
    edgesRef.current.clear();
    await loadHighLevelView();
    loadHighLevelEdgeList();
  };

  useEffect(() => {
    onViewGraph();
  }, [graphID]);

  useEffect(() => {
    if (!networkContainerRef.current) {
      console.error('Network container ref is not assigned');
      return;
    }

    const options = {
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
      // configure: {
      //   enabled: true,
      //   filter: 'nodes,edges',
      //   container: undefined,
      //   showButton: true
      // }
    };

    const network = new Network(networkContainerRef.current, { nodes: nodesRef.current, edges: edgesRef.current }, options);

    return () => {
      network.destroy();
    };
  }, []);

  return (
    <div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
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
      {progressing && <Progress percent={percent} showInfo={false} />}
    </div>
  );
};

export default TwoLevelGraphVisualization;