'use client';
import React from "react";
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

const text = `
  Graphs' details (size, last_modified, nodes, edges)
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'Worker 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'Worker 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'Worker 3',
    children: <p>{text}</p>,
  },
];

export default function GraphDistribution() {
  return (
    <div className="">
      <div style={{margin: "20px 0px", width: "80%"}}>
        <h1 style={{fontSize: "xx-large", fontWeight: "600", lineHeight: "1.5"}}>Graph Database Distribution</h1>
        <p>This section provides an overview of the distribution of graph datasets across different workers. 
          Click on each worker to view the specific graph datasets stored on their respective nodes. 
          This information helps in managing and monitoring the graph dataset deployment effectively.
        </p>
      </div>
      <div style={{width: "80%"}}>
        <Collapse items={items} defaultActiveKey={['1']} />
      </div>
    </div>
  );
}
