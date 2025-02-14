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
import { getGraphDegreeData } from '@/services/graph-visualiztion';
import { Button, Progress, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

type Props = {
  graphID: any;
  degree: string;
}

type DataNode = {
  node: string;
  value: string;
}

const InDegreeVisualization = ({graphID, degree}:Props) => {
  const [loading, setLoading] = React.useState(false);
  const [progressing, setProgressing] = React.useState(false);
  const [percent, setPercent] = React.useState<number>(0);
  const [graph, setGraph] = React.useState<DataNode[]>([]);

  const getGraph = async () => {
    try{
      setLoading(true);
      const res = await getGraphDegreeData(graphID, degree);
      setLoading(false);
      setPercent(0);
      setProgressing(true);
      
      return res || [];
    }catch(err){
      console.log("error while getting graph data: ", err);
      setLoading(false);
    }
  }
  
  const onViewGraph = async () => {
    const graph = await getGraph();
    setGraph(graph || []);
  }

  useEffect(() => {
    onViewGraph()
  }, [graphID, degree])

  return (
    <div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
      <ScatterChart
        width={1080}
        height={500}
        series={[
          {
            data: graph.map((v, index) => ({ x: Number(v.node), y: Number(v.value), id: index })),
          },
        ]}
      />
      {progressing && <Progress percent={percent} showInfo={false} />}
    </div>
  );
};

export default InDegreeVisualization;
