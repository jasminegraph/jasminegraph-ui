'use client';
import { getGraphVizualization } from '@/services/graph-visualiztion';
import { Button, Progress, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import { LoadingOutlined } from '@ant-design/icons';

import 'vis-network/styles/vis-network.css';

type INode = {
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
      const res = await getGraphVizualization();
      console.log(res);
      setLoading(false);
      setPercent(0);
      setProgressing(true);
      // Function to introduce a delay
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      if(res.data){
        const newNodes: INode[] = res.data.nodes ?? [];
        const newEdges: IEdge[] = res.data.edges ?? [];
        const nodeCount = newNodes.length

        newEdges.forEach((edge, index) => edgesRef.current.add(edge));  
        for (let index = 0; index < newNodes.length; index++) {
          const node = newNodes[index];
          nodesRef.current.add(node);
          await delay(75);
          setPercent(Math.ceil((index/nodeCount)*100))
        }
        
      }
      return res;
    }catch(err){
      console.log(err);
      setLoading(false);
    }
  }
  
  const onViewGraph = async (key: string) => {
    console.log("::onViewGraph::", key);
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
      physics: {
        enabled: true,
      },
    };

    // Initialize the network
    const network = new Network(networkContainerRef.current, { nodes: nodesRef.current, edges: edgesRef.current }, options);

    return () => {
      // Cleanup on component unmount
      network.destroy();
    };
  }, []);

  // const addEdge = () => {
    
  //   const newNodes: INode[] = [
  //     { id: nodeCount, label: `Node ${nodeCount}`, shape: 'dot', color: '#97c2fc'},
  //     { id: nodeCount + 1, label: `Node ${nodeCount + 1}`, shape: 'dot', color: '#97c2fc'},
  //   ]
  //   const newEdge: IEdge[] = [
  //     { from: nodeCount + 1, to: nodeCount}
  //   ]

  //   newNodes.forEach(node => nodesRef.current.add(node))
  //   newEdge.forEach(edge => edgesRef.current.add(edge))
  //   setNodeCount(nodeCount+2)

  //   console.log("EDGE ADD")
  // }

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



// [{"id": 1, "label": "Node 1"},
//   {"id": 2, "label": "Node 2"},
//   {"id": 3, "label": "Node 3"},
//   {"id": 5, "label": "Node 5"},
//   {"id": 7, "label": "Node 7"},
//   {"id": 6, "label": "Node 6"},
//   {"id": 8, "label": "Node 8"},
//   {"id": 9, "label": "Node 9"},
//   {"id": 10, "label": "Node 10"},
//   {"id": 12, "label": "Node 12"},
//   {"id": 13, "label": "Node 13"},
//   {"id": 14, "label": "Node 14"},
//   {"id": 15, "label": "Node 15"},
//   {"id": 16, "label": "Node 16"},
//   {"id": 17, "label": "Node 17"},
//   {"id": 19, "label": "Node 19"},
//   {"id": 18, "label": "Node 18"},
//   {"id": 20, "label": "Node 20"},
//   {"id": 27, "label": "Node 27"},
//   {"id": 29, "label": "Node 29"},
//   {"id": 34, "label": "Node 34"},
//   {"id": 33, "label": "Node 33"},
//   {"id": 35, "label": "Node 35"},
//   {"id": 36, "label": "Node 36"},
//   {"id": 37, "label": "Node 37"},
//   {"id": 38, "label": "Node 38"},
//   {"id": 39, "label": "Node 39"},
//   {"id": 42, "label": "Node 42"},
//   {"id": 41, "label": "Node 41"},
//   {"id": 47, "label": "Node 47"},
//   {"id": 44, "label": "Node 44"},
//   {"id": 45, "label": "Node 45"},
//   {"id": 46, "label": "Node 46"},
//   {"id": 50, "label": "Node 50"},
//   {"id": 51, "label": "Node 51"},
//   {"id": 21, "label": "Node 21"},
//   {"id": 53, "label": "Node 53"},
//   {"id": 24, "label": "Node 24"},
//   {"id": 58, "label": "Node 58"},
//   {"id": 25, "label": "Node 25"},
//   {"id": 59, "label": "Node 59"},
//   {"id": 60, "label": "Node 60"},
//   {"id": 61, "label": "Node 61"},
//   {"id": 62, "label": "Node 62"},
//   {"id": 31, "label": "Node 31"},
//   {"id": 68, "label": "Node 68"},
//   {"id": 63, "label": "Node 63"},
//   {"id": 64, "label": "Node 64"},
//   {"id": 65, "label": "Node 65"},
//   {"id": 69, "label": "Node 69"},
//   {"id": 66, "label": "Node 66"},
//   {"id": 70, "label": "Node 70"},
//   {"id": 67, "label": "Node 67"},
//   {"id": 73, "label": "Node 73"},
//   {"id": 72, "label": "Node 72"},
//   {"id": 75, "label": "Node 75"},
//   {"id": 48, "label": "Node 48"},
//   {"id": 77, "label": "Node 77"},
//   {"id": 76, "label": "Node 76"},
//   {"id": 79, "label": "Node 79"},
//   {"id": 78, "label": "Node 78"},
//   {"id": 80, "label": "Node 80"},
//   {"id": 82, "label": "Node 82"},
//   {"id": 81, "label": "Node 81"},
//   {"id": 83, "label": "Node 83"},
//   {"id": 86, "label": "Node 86"},
//   {"id": 71, "label": "Node 71"},
//   {"id": 88, "label": "Node 88"},
//   {"id": 4, "label": "Node 4"},
//   {"id": 55, "label": "Node 55"},
//   {"id": 87, "label": "Node 87"},
//   {"id": 89, "label": "Node 89"},
//   {"id": 90, "label": "Node 90"},
//   {"id": 91, "label": "Node 91"},
//   {"id": 94, "label": "Node 94"},
//   {"id": 11, "label": "Node 11"},
//   {"id": 26, "label": "Node 26"},
//   {"id": 43, "label": "Node 43"},
//   {"id": 92, "label": "Node 92"},
//   {"id": 93, "label": "Node 93"},
//   {"id": 95, "label": "Node 95"},
//   {"id": 97, "label": "Node 97"},
//   {"id": 40, "label": "Node 40"},
//   {"id": 98, "label": "Node 98"},
//   {"id": 28, "label": "Node 28"},
//   {"id": 57, "label": "Node 57"},
//   {"id": 74, "label": "Node 74"},
//   {"id": 100, "label": "Node 100"},
//   {"id": 99, "label": "Node 99"},
//   {"id": 101, "label": "Node 101"},
//   {"id": 104, "label": "Node 104"},
//   {"id": 106, "label": "Node 106"},
//   {"id": 107, "label": "Node 107"},
//   {"id": 108, "label": "Node 108"},
//   {"id": 109, "label": "Node 109"},
//   {"id": 54, "label": "Node 54"},
//   {"id": 110, "label": "Node 110"},
//   {"id": 111, "label": "Node 111"},
//   {"id": 52, "label": "Node 52"},
//   {"id": 112, "label": "Node 112"},
//   {"id": 113, "label": "Node 113"},
//   {"id": 115, "label": "Node 115"},
//   {"id": 114, "label": "Node 114"},
//   {"id": 116, "label": "Node 116"},
//   {"id": 117, "label": "Node 117"},
//   {"id": 118, "label": "Node 118"},
//   {"id": 119, "label": "Node 119"},
//   {"id": 56, "label": "Node 56"},
//   {"id": 120, "label": "Node 120"},
//   {"id": 122, "label": "Node 122"},
//   {"id": 121, "label": "Node 121"},
//   {"id": 123, "label": "Node 123"},
//   {"id": 30, "label": "Node 30"},
//   {"id": 125, "label": "Node 125"},
//   {"id": 129, "label": "Node 129"},
//   {"id": 126, "label": "Node 126"},
//   {"id": 127, "label": "Node 127"},
//   {"id": 128, "label": "Node 128"},
//   {"id": 130, "label": "Node 130"},
//   {"id": 131, "label": "Node 131"},
//   {"id": 135, "label": "Node 135"},
//   {"id": 136, "label": "Node 136"},
//   {"id": 139, "label": "Node 139"},
//   {"id": 138, "label": "Node 138"},
//   {"id": 140, "label": "Node 140"},
//   {"id": 102, "label": "Node 102"},
//   {"id": 141, "label": "Node 141"},
//   {"id": 142, "label": "Node 142"},
//   {"id": 143, "label": "Node 143"},
//   {"id": 144, "label": "Node 144"},
//   {"id": 96, "label": "Node 96"},
//   {"id": 145, "label": "Node 145"},
//   {"id": 103, "label": "Node 103"},
//   {"id": 146, "label": "Node 146"},
//   {"id": 147, "label": "Node 147"},
//   {"id": 148, "label": "Node 148"},
//   {"id": 149, "label": "Node 149"},
//   {"id": 150, "label": "Node 150"},
//   {"id": 151, "label": "Node 151"},
//   {"id": 85, "label": "Node 85"},
//   {"id": 152, "label": "Node 152"},
//   {"id": 153, "label": "Node 153"},
//   {"id": 124, "label": "Node 124"},
//   {"id": 154, "label": "Node 154"},
//   {"id": 155, "label": "Node 155"},
//   {"id": 32, "label": "Node 32"},
//   {"id": 156, "label": "Node 156"},
//   {"id": 157, "label": "Node 157"},
//   {"id": 158, "label": "Node 158"},
//   {"id": 159, "label": "Node 159"},
//   {"id": 160, "label": "Node 160"},
//   {"id": 161, "label": "Node 161"},
//   {"id": 163, "label": "Node 163"},
//   {"id": 162, "label": "Node 162"},
//   {"id": 164, "label": "Node 164"},
//   {"id": 165, "label": "Node 165"},
//   {"id": 166, "label": "Node 166"},
//   {"id": 167, "label": "Node 167"},
//   {"id": 170, "label": "Node 170"},
//   {"id": 168, "label": "Node 168"},
//   {"id": 169, "label": "Node 169"},
//   {"id": 171, "label": "Node 171"},
//   {"id": 172, "label": "Node 172"},
//   {"id": 173, "label": "Node 173"},
//   {"id": 174, "label": "Node 174"},
//   {"id": 175, "label": "Node 175"},
//   {"id": 176, "label": "Node 176"},
//   {"id": 178, "label": "Node 178"},
//   {"id": 177, "label": "Node 177"},
//   {"id": 179, "label": "Node 179"},
//   {"id": 180, "label": "Node 180"},
//   {"id": 181, "label": "Node 181"},
//   {"id": 184, "label": "Node 184"},
//   {"id": 105, "label": "Node 105"},
//   {"id": 182, "label": "Node 182"},
//   {"id": 183, "label": "Node 183"},
//   {"id": 185, "label": "Node 185"},
//   {"id": 186, "label": "Node 186"},
//   {"id": 187, "label": "Node 187"},
//   {"id": 188, "label": "Node 188"},
//   {"id": 189, "label": "Node 189"},
//   {"id": 190, "label": "Node 190"}]