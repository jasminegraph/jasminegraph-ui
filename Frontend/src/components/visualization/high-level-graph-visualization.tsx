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

import { Alert, Button, Card, message, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import { LoadingOutlined } from "@ant-design/icons";
import "vis-network/styles/vis-network.css";
import { IGraphDetails } from "@/types/graph-types";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
import { useAppSelector } from "@/redux/hook";
import { ERROR_MSG } from './low-level-graph-visualization';
import { VISUALIZATION_VERTEX_LIMIT } from "@/properties";

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
    onPartitionClick: (partitionId: number | null | undefined) => Promise<void>;
    onLowLevelViewClick: () => void;
    selectedNode: number[] | null;
    setSelectedNode: React.Dispatch<React.SetStateAction<number[] | null>>;
};

// Default network options
const networkOptions = {
    nodes: {
        shape: "dot",
        font: { size: 15 },
        color: { border: "#2B7CE9", background: "#97C2FC" },
    },
    edges: {
        color: { color: "#848484", highlight: "#848484", hover: "#848484" },
        width: 2,
    },
    autoResize: true,
};

const TwoLevelGraphVisualization = ({
                                        graphID,
                                        graph,
                                        onPartitionClick,
                                        onLowLevelViewClick,
                                        selectedNode,
                                        setSelectedNode
                                    }: Props) => {
    const [loading, setLoading] = useState(false);
    const networkContainerRef = useRef<HTMLDivElement>(null);
    const [network, setNetwork] = useState<Network | null>(null);
    const nodesRef = useRef<any>(new DataSet([]));
    const edgesRef = useRef<any>(new DataSet([]));
    const [vertexCountExceed, setVertexCountExceed] = useState<boolean>(false);

    // Helper: scale vertexcount to node size
    const getNodeSize = (vertexCount: number) => {
        const minSize = 20;
        const maxSize = 100;
        const scaleFactor = 0.5; // Adjust to tune size relative to vertexcount
        const size = Math.min(maxSize, Math.max(minSize, vertexCount * scaleFactor));
        return size;
    };

    const loadHighLevelEdgeList = (): IEdge[] => {
        const edges: IEdge[] = [];
        const partitionCount = graph?.partitions.length || 0;
        for (let i = 0; i < partitionCount; i++) {
            for (let j = i + 1; j < partitionCount; j++) {
                edges.push({ from: graph!.partitions[i].idpartition, to: graph!.partitions[j].idpartition });
            }
        }
        return edges;
    };

    const loadHighLevelView = async () => {
        try {
            setLoading(true);
            nodesRef.current.clear();
            edgesRef.current.clear();

            if (graph && graph.partitions && Array.isArray(graph.partitions)) {
                // Create nodes with size proportional to vertexcount
                const validatedNodes = graph.partitions.map((partition) => ({
                    id: partition.idpartition,
                    label: partition.idpartition.toString(),
                    shape: "dot",
                    color: "#97c2fc",
                    size: getNodeSize(partition.vertexcount),
                }));

                // Create edges
                const validatedEdges = loadHighLevelEdgeList();

                edgesRef.current.add(validatedEdges);
                nodesRef.current.add(validatedNodes);

                if (network) {
                    network.setData({ nodes: nodesRef.current, edges: edgesRef.current });
                    network.fit();
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
        nodesRef.current.clear();
        edgesRef.current.clear();
        await loadHighLevelView();
    };

    useEffect(() => {
        onViewGraph();
    }, [graphID]);

    useEffect(() => {
        if (!networkContainerRef.current) return;

        const nodes = graph?.partitions.map((partition) => ({
            id: partition.idpartition,
            label: `Partition ${partition.idpartition}`,
            shape: "dot",
            color: "#97c2fc",
            size: getNodeSize(partition.vertexcount),
        }));

        const edges: IEdge[] = loadHighLevelEdgeList();

        const net = new Network(
            networkContainerRef.current,
            { nodes: nodes || [], edges },
            networkOptions
        );

        net.on("selectNode", (params) => setSelectedNode(params.nodes));
        net.on("deselectNode", (params) => setSelectedNode(params.nodes));

        setNetwork(net);

        return () => net.destroy();
    }, [graph]);

    const getDetails = () => {
        const partitionDetails = graph?.partitions.find(
            (g) => selectedNode && g.idpartition === selectedNode[0]
        );
        return [
            { key: "1", label: "vertexcount", children: `${partitionDetails?.vertexcount}` },
            { key: "2", label: "edgecount", children: `${partitionDetails?.edgecount}` },
            { key: "3", label: "central_vertexcount", children: `${partitionDetails?.central_vertexcount}` },
            { key: "4", label: "central_edgecount", children: `${partitionDetails?.central_edgecount}` },
            { key: "5", label: "central_edgecount_with_dups", children: `${partitionDetails?.central_edgecount_with_dups}` },
        ];
    };

    const onLowLevelView = async () => {
        const nodeDetails = graph?.partitions.find(
            (g) => selectedNode && g.idpartition === selectedNode[0]
        );
        if (!nodeDetails) {
            message.warning("No node details found for the selected node.");
            return;
        }
        // if (nodeDetails.vertexcount > VISUALIZATION_VERTEX_LIMIT) {
        //     setVertexCountExceed(true);
        //     message.warning(`Vertex count exceeds ${VISUALIZATION_VERTEX_LIMIT}. Cannot view low-level graph.`);
        //     return;
        // } else {
            setVertexCountExceed(false);
        // }
        if (selectedNode && selectedNode.length > 0) {
            await onPartitionClick(selectedNode[0]);
        }
        onLowLevelViewClick();
    };

    return (
        <div>
            <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />
            {vertexCountExceed && (
                <Alert
                    message={`Vertex count exceeds ${VISUALIZATION_VERTEX_LIMIT}. Cannot view low-level graph.`}
                    type="warning"
                />
            )}
            <div style={{ position: "relative", border: "1px solid red", height: "600px", aspectRatio: "16/9" }}>
                <div
                    ref={networkContainerRef}
                    style={{ height: "600px", border: "1px solid lightgray", backgroundColor: "#ffffff", aspectRatio: "16/9" }}
                />
                <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                    {selectedNode && selectedNode.length > 0 && (
                        <Card style={{ maxWidth: 300 }}>
                            <Descriptions column={1} title={`Partition ${selectedNode}`} items={getDetails()} />
                            <Button type="primary" onClick={() => onLowLevelView()}>
                                View Graph
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoLevelGraphVisualization;
