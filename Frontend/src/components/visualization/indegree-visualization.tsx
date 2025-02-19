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
import React, { useState, useEffect } from 'react';
import { Progress, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { useAppSelector } from '@/redux/hook';
import { GraphType } from '@/data/graph-data';

type Props = {
  loading: boolean;
  degree: GraphType;
}

const InDegreeVisualization = ({loading, degree}:Props) => {
  const [progressing, setProgressing] = useState(false);
  const [percent, setPercent] = useState<number>(0);

  const { inDegreeDataPool, outDegreeDataPool } = useAppSelector((state) => state.queryData)
  
  const [dataPool, setDataPool] = useState(degree === "in_degree" ? inDegreeDataPool : outDegreeDataPool);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDataPool(degree === "in_degree" ? inDegreeDataPool : outDegreeDataPool);
    }, 300); // Delay updates by 300ms

    return () => clearTimeout(timeout); // Cleanup on re-render
  }, [degree, inDegreeDataPool, outDegreeDataPool]);

  return (
    <div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
      <ScatterChart
        width={1080}
        height={500}
        series={[
          {
            data: dataPool.map((point, index) => ({ x: Number(point.node), y: Number(point.value), id: index })),
          },
        ]}
      />
      {progressing && <Progress percent={percent} showInfo={false} />}
    </div>
  );
};

export default InDegreeVisualization;
