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
import { Progress, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import { LoadingOutlined } from '@ant-design/icons';
import 'vis-network/styles/vis-network.css';
import { useAppSelector } from '@/redux/hook';
import { INode } from './graph-visualization';
import randomColor from 'randomcolor';
import { delay } from '@/utils/time';

const DEFAULT_DELAY = 75;

const QueryVisualization = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [progressing, setProgressing] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const networkContainerRef = useRef(null); // Reference for the container
  const nodesRef = useRef<any>(null);
  const edgesRef = useRef<any>(null);
  const { messagePool } = useAppSelector((state) => state.queryData);

  

  const RefreshGraph = async () => {
    let colorMap = new Map<string, string>();
    setLoading(true)
    setProgressing(true)
    nodesRef.current = new DataSet([]);
    Object.keys(messagePool).forEach((key) => {
      const messages = messagePool[key];
      console.log(messages)
      let color = colorMap.get(key);
      if(!color){
        color = randomColor({format: 'hex'});
        colorMap.set(key, color)
      }

      messages.forEach(async (data) => {
        const node: INode = { 
          id: data.id, 
          label: data.name,
          shape: "dot",
          color
        }
        nodesRef.current.add(node);
        await delay(DEFAULT_DELAY);
      })
    })
    // for (let index = 0; index < Object.keys(messagePool).length; index++) {
    //   const message = messagePool[index];
    //   let color = colorMap.get(index);
    //   if(!color){
    //     color = randomColor({format: 'hex'});
    //     colorMap.set(message.type, color)
    //   }
    //   const node: INode = { 
    //     id: message.id, 
    //     label: message.name,
    //     shape: "dot",
    //     color
    //   }
    //   nodesRef.current.add(node);
    //   await delay(DEFAULT_DELAY);
    //   setPercent(Math.ceil((index+1/messagePool.length)*100))
    // }
    setLoading(false);
  }

  useEffect(() => {
    RefreshGraph();
  }, [messagePool])

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

  return (
    <div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
      <div
        ref={networkContainerRef}
        style={{
          width: '100%',
          height: '450px',
          border: '1px solid lightgray',
          backgroundColor: '#ffffff',
        }}
      ></div>
      {progressing && <Progress percent={percent} showInfo={false} />}
    </div>
  );
};

export default QueryVisualization;
