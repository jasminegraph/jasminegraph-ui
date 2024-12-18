/**
Copyright 2024 JasminGraph Team
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
import React from "react";
import type { CollapseProps } from 'antd';
import { Button, Collapse, Modal, Spin } from 'antd';
import { getGraphVizualization } from "@/services/graph-visualiztion";
import { LoadingOutlined } from '@ant-design/icons';

const text = `
  Graphs' details (size, last_modified, nodes, edges)
`;

export default function GraphDistribution() {
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [graph, setGraph] = React.useState<any>(null);

  const getGraph = async () => {
    try{
      setLoading(true);
      const res = await getGraphVizualization();
      console.log(res);
      setLoading(false);
      return res;
    }catch(err){
      console.log(err);
      setLoading(false);
    }
  }

  const onViewGraph = async (key: string) => {
    console.log("::onViewGraph::", key);
    setOpenModal(true);
    const graph = await getGraph();
    setGraph(graph);
  }

  const IFrameRenderer = ({ htmlContent }:{htmlContent: string}) => {
    return (
        <iframe
            title="Graph Renderer"
            srcDoc={htmlContent}
            style={{ width: "100%", height: "600px", border: "none" }}
            sandbox="allow-scripts allow-same-origin"
        />
    );
  };

  const CollapseComponent = ({key}:{key: string}) => {
    return (
      <div className="flex align-center justify-between">
        <p>{text}</p>
        <Button color="primary" type="default" onClick={() => onViewGraph(key)}>
          View
        </Button>
      </div>
    );
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Worker 1',
      children: <CollapseComponent key="1" />,
    },
    {
      key: '2',
      label: 'Worker 2',
      children: <CollapseComponent key="2" />,
    }
  ];

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
      <Modal
        title="Graph"
        open={openModal}
        footer={<></>}
        width={1200}
        onCancel={() => setOpenModal(false)}
      >
        {loading ? (<Spin indicator={<LoadingOutlined spin />} size="default" />
      ):(
        <div><IFrameRenderer htmlContent={graph} /></div>
      )}
      </Modal>
    </div>
  );
}
