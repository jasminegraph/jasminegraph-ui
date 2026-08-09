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
"use client";

import {Button, Card, Progress, Spin, Descriptions} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {LeftOutlined} from "@ant-design/icons";
import {useAppSelector} from "@/redux/hook";
const PARTITION_PALETTE = [
    "#0d47a1", // navy blue
    "#1565c0", // dark blue
    "#1976d2", // medium-dark blue
    "#283593", // deep indigo-blue
    "#0277bd", // dark cyan-blue
    "#01579b", // dark ocean blue
];
import Graph from "graphology";
import Sigma from "sigma";
import FA2 from "graphology-layout-forceatlas2";


interface Props {
    onHighLevelViewClick: () => void, 
    totalNoOfEdges?: number | null,
    serverTimes?: number[],
    currentTimeIndex?: number,
}

interface INode {
    name: any;
    id: number;
    label: string;
    partitionID?: number;
    color?: string;
}

interface IEdge {
    type: string;
    from: number;
    to: number;
    label?: string;
    properties?: Record<string, unknown>;
    eventTime?: number;
}

const normalizeEventTime = (edge: IEdge | Record<string, any>): number | null => {
    const candidates = [
        (edge as any)?.eventTime,
        (edge as any)?.properties?.eventTime,
        (edge as any)?.timestamp,
        (edge as any)?.properties?.timestamp,
    ];

    for (const candidate of candidates) {
        if (candidate === undefined || candidate === null || candidate === "") {
            continue;
        }
        const parsed = Number(candidate);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return null;
};

const LowLevelGraphVisualization = ({
    onHighLevelViewClick,
    totalNoOfEdges,
    serverTimes = [],
    currentTimeIndex = 0,
}: Props) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const [hoveredNode, setHoveredNode] = useState<any | null>(null);
    const [hoveredEdge, setHoveredEdge] = useState<any | null>(null);
    const [retrievedAt, setRetrievedAt] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<any>(null);
    const rendererRef = useRef<any>(null);
    const partitionColorMap = useRef<Map<number, string>>(new Map());
    const temporalThresholdRef = useRef<number | null>(null);
    const hasFinalRenderDone = useRef(false);

    const lowLevelGraphData = useAppSelector((state) => state.queryData.visualizeData);
    const isRender = useAppSelector((state) => state.queryData.visualizeData.render);
    const updateProgress = useAppSelector((state) => state.queryData.visualizeData.updateProgress);

    const hasTemporalData = serverTimes.length > 0;
    const currentTemporalThreshold = hasTemporalData ? serverTimes[currentTimeIndex] : null;

    const applyTemporalFilter = (graph: any, threshold: number | null) => {
        temporalThresholdRef.current = threshold;

        graph.forEachEdge((edgeKey: string, attrs: any) => {
            const edgeTime = normalizeEventTime(attrs);
            const visible = threshold === null || edgeTime === null || edgeTime <= threshold;
            graph.setEdgeAttribute(edgeKey, "hidden", !visible);
        });

        graph.forEachNode((nodeKey: string) => {
            const connectedEdges = graph.edges(nodeKey) as string[];
            if (!connectedEdges.length) {
                graph.setNodeAttribute(nodeKey, "hidden", false);
                return;
            }

            const hasVisibleEdge = connectedEdges.some((edgeKey) => {
                return graph.getEdgeAttribute(edgeKey, "hidden") !== true;
            });

            graph.setNodeAttribute(nodeKey, "hidden", !hasVisibleEdge);
        });
    };

    const getColor = (partitionID: number) => {
        if (!partitionColorMap.current.has(partitionID)) {
            partitionColorMap.current.set(partitionID, PARTITION_PALETTE[partitionID % PARTITION_PALETTE.length]);
        }
        return partitionColorMap.current.get(partitionID)!;
    };

    const handleSearch = (query: string) => {
        if (!query || query == "" || !graphRef.current || !rendererRef.current) return;

        const graph = graphRef.current;
        const renderer = rendererRef.current;
        const camera = renderer.getCamera();
        const lowerQuery = query.toLowerCase();

        const matchedNodes: string[] = [];

        // Search by ID and attributes
        graph.forEachNode((node: string, attrs: any) => {
            if (node.toString().includes(lowerQuery)) {
                matchedNodes.push(node);
            } else {
                for (const key in attrs) {
                    const value = attrs[key];
                    if (value != null && String(value).toLowerCase().includes(lowerQuery)) {
                        matchedNodes.push(node);
                        break;
                    }
                }
            }
        });

        if (matchedNodes.length === 0) return;

        // Reset all highlights
        graph.forEachNode((node: string) => graph.setNodeAttribute(node, "highlighted", false));
        graph.forEachEdge((edge: string) => graph.setEdgeAttribute(edge, "highlighted", false));

        // Highlight matched nodes
        matchedNodes.forEach((node) => graph.setNodeAttribute(node, "highlighted", true));

        // Highlight edges connecting matched nodes
        graph.forEachEdge((edge: string, attr: any, source: string, target: string) => {
            if (matchedNodes.includes(source) && matchedNodes.includes(target)) {
                graph.setEdgeAttribute(edge, "highlighted", true);
            }
        });

        // Optionally zoom to fit all matched nodes
        const positions = matchedNodes.map((node) => renderer.getNodeDisplayData(node)).filter(Boolean);
        if (positions.length > 0) {
            const xValues = positions.map((p) => p!.x);
            const yValues = positions.map((p) => p!.y);
            const minX = Math.min(...xValues);
            const maxX = Math.max(...xValues);
            const minY = Math.min(...yValues);
            const maxY = Math.max(...yValues);
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const ratio = Math.max(maxX - minX, maxY - minY) / 400 + 0.1; // adjust zoom factor
            camera.animate({x: centerX, y: centerY, ratio}, {duration: 700, easing: "linear"});
        }
    };


    // Initialize Sigma once
    useEffect(() => {
        const initGraph = async () => {
            if (typeof window === "undefined" || !containerRef.current) return;
            setRetrievedAt(new Date().toLocaleString());
            const graph = new Graph({multi: true, type: "directed"});
            graphRef.current = graph;

            const renderer = new Sigma(graph, containerRef.current, {
                renderLabels: true,
                renderEdgeLabels: false,
                labelSize: 12,
                labelWeight: "600",
                labelColor: { color: "#1a2340" },
                defaultEdgeColor: "#475569",
                defaultNodeColor: "#6ea3f7",
                minCameraRatio: 0.05,
                maxCameraRatio: 5,
                nodeProgramClasses: {},
                edgeProgramClasses: {},
                enableEdgeEvents: true,
            });
            rendererRef.current = renderer;
            // --- HOVER TOOLTIP EVENTS ---
            renderer.on("enterNode", ({ node }) => {
                const attrs = graph.getNodeAttributes(node);
                setHoveredNode({ id: node, ...attrs });

                const neighbors = new Set(graph.neighbors(node));

                // Dim non-neighbors instead of hiding them
                graph.forEachNode((n) => {
                    const isRelevant = n === node || neighbors.has(n);
                    graph.setNodeAttribute(n, "highlighted", isRelevant);
                    graph.setNodeAttribute(n, "color",
                        isRelevant
                            ? (graph.getNodeAttribute(n, "baseColor") ?? graph.getNodeAttribute(n, "color"))
                            : "#c8d0e8"
                    );
                });

                // Dim edges not connected to hovered node
                graph.forEachEdge((edge, attr, source, target) => {
                    const visible = source === node || target === node;
                    graph.setEdgeAttribute(edge, "color", visible ? "#1e293bee" : "#47556933");
                    graph.setEdgeAttribute(edge, "size", visible ? 2.5 : 0.8);
                });
            });


            renderer.on("leaveNode", () => {
                // Restore all node colors to their base color
                graph.forEachNode((n) => {
                    graph.setNodeAttribute(n, "highlighted", false);
                    graph.setNodeAttribute(n, "color", graph.getNodeAttribute(n, "baseColor"));
                });

                // Restore all edge colors
                graph.forEachEdge((e) => {
                    graph.setEdgeAttribute(e, "color", "#475569cc");
                    graph.setEdgeAttribute(e, "size", 2);
                    graph.setEdgeAttribute(e, "highlighted", false);
                });

                applyTemporalFilter(graph, temporalThresholdRef.current);
                setHoveredNode(null);
            });



            renderer.on("enterEdge", ({edge}) => {
                const attrs = graph.getEdgeAttributes(edge);
                setHoveredEdge({id: edge, ...attrs});
                graph.setEdgeAttribute(edge, "color", "#ff9800");
                graph.setEdgeAttribute(edge, "size", 4);
            });

            renderer.on("leaveEdge", ({edge}) => {
                graph.setEdgeAttribute(edge, "color", "#475569cc");
                graph.setEdgeAttribute(edge, "size", 2);
                setHoveredEdge(null);
            });

            // Click node: zoom camera to it
            renderer.on("clickNode", ({ node }) => {
                setSelectedNodeId(node as any);

                const camera = renderer.getCamera();
                const pos = renderer.getNodeDisplayData(node);

                if (pos) {
                    camera.animate(
                        { x: pos.x, y: pos.y, ratio: 0.15 },
                        { duration: 500, easing: "quadraticInOut" }
                    );
                }
            });
            

            // Click background: deselect
            renderer.on("clickStage", () => {
                setSelectedNodeId(null);
            });
              };

        initGraph();
    }, []);

    useEffect(() => {

        if (totalNoOfEdges != null && totalNoOfEdges !== 0) {
            setProgress(Math.round((lowLevelGraphData.edge.length / totalNoOfEdges) * 100));
        }
    }, [updateProgress]);
    // Incremental updates
    useEffect(() => {
        const updateGraph = async () => {
            if (!graphRef.current || !lowLevelGraphData) return;


            const graph = graphRef.current;
            const nodes: INode[] = lowLevelGraphData.node || [];
            const edges: IEdge[] = lowLevelGraphData.edge || [];

            const total = nodes.length + edges.length;
            let count = 0;

            // Add nodes
            nodes.forEach((n) => {
                if (!graph.hasNode(n.id)) {
                    const baseColor = getColor(n.partitionID ?? 0);
                    graph.addNode(n.id, {
                        ...n,
                        category: n.label,
                        label: n.name,
                        size: 6,
                        color: baseColor,
                        baseColor,          // kept for hover restore
                        borderColor: "#ffffff",
                        borderSize: 0.3,
                        x: (Math.random() - 0.5) * 20,
                        y: (Math.random() - 0.5) * 20,
                    });
                }
                count++;
            });

            // Add edges
            edges.forEach((e) => {
                if (
                    graph.hasNode(e.from) &&
                    graph.hasNode(e.to)
                ) {
                    const edgeTime = normalizeEventTime(e);
                    // Normalize node order so A→B and B→A share the same key (undirected dedup)
                    const [kA, kB] = [e.from, e.to].sort();
                    const edgeKey = `${kA}-${kB}-${edgeTime ?? "na"}`;

                    if (graph.hasEdge(edgeKey)) {
                        return;
                    }

                    graph.addEdgeWithKey(edgeKey, e.from, e.to, {
                        ...e,
                        from: e.from,
                        to: e.to,
                        type: "line",
                        relationType: e.type ?? e.label,
                        label: e.label ?? e.type ?? "",
                        color: "#475569cc",
                        size: 2,
                        eventTime: edgeTime,
                    });
                }

                count++;
            });

            // Degree-based node sizing — more pronounced scale
            graph.forEachNode((node: string, attr: any) => {
                const degree = graph.degree(node);
                const newSize = Math.log(degree + 1) * 4 + 5;
                graph.setNodeAttribute(node, "size", newSize);
            });

            if (isRender && !hasFinalRenderDone.current) {
                hasFinalRenderDone.current = true;
                FA2.assign(graph, { iterations: 600, settings: { gravity: 1, scalingRatio: 10, strongGravityMode: false, slowDown: 5 } });
                applyTemporalFilter(graph, currentTemporalThreshold);
                console.log('[updateGraph] nodes:', nodes.length, '| edges:', graph.size, '| isRender: true — final render');
                setLoading(false);
            } else if (hasFinalRenderDone.current) {
                // Temporal slider update: only re-apply filter, skip FA2
                applyTemporalFilter(graph, currentTemporalThreshold);
            } else {
                // Incremental streaming update
                applyTemporalFilter(graph, currentTemporalThreshold);
            }
        };

        updateGraph();
    }, [isRender, currentTemporalThreshold]);

    const getNodeDetails = () => {
        if (!selectedNodeId) return [];
        const node = lowLevelGraphData.node.find((n: any) => n.id === selectedNodeId);
        if (!node) return [];
        return Object.keys(node).map((k, i) => ({
            key: i.toString(),
            label: k,
            children: String(node[k]),
        }));
    };

    return (
        <div style={{width: "100%", height: "100%"}}>

            <div
                style={{
                    position: "relative",
                    width: "150%",
                    maxWidth: "1400px",
                    height: "calc(100vh - 150px)",
                    margin: "0 auto",
                    border: "1px solid #c5d0e8",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #f0f4ff 0%, #e8edf8 50%, #f5f8ff 100%)",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(100,120,180,0.18)",
                }}
            >
                {/* Top-right toolbar: temporal slider + search */}
                <div
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 16,
                        zIndex: 25,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(100,120,180,0.22)",
                        borderRadius: 10,
                        padding: "8px 14px",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 4px 16px rgba(100,120,180,0.15)",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search node..."
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{
                            width: 200,
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid rgba(100,120,180,0.35)",
                            background: "rgba(255,255,255,0.95)",
                            color: "#1a2340",
                            fontSize: 13,
                            outline: "none",
                        }}
                    />
                </div>

                <div ref={containerRef} style={{width: "100%", height: "100%"}}>
                    {loading && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "rgba(240,244,255,0.92)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1000,
                                flexDirection: "column",
                            }}
                        >
                            <Spin size="large" />
                            <div style={{marginTop: 12}}>
                                <Progress
                                    percent={progress}
                                    showInfo
                                    strokeColor={{from: "#4a7ef5", to: "#7c5fe6"}}
                                    trailColor="rgba(100,120,180,0.15)"
                                    style={{width: 200}}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Hover Tooltip */}
                {hoveredNode && (
                    <div style={{position: "absolute", top: 60, left: 16, zIndex: 10}}>
                        <Card
                            size="small"
                            style={{
                                maxWidth: 280, borderRadius: 10,
                                background: "rgba(255,255,255,0.97)",
                                border: "1px solid rgba(100,120,180,0.22)",
                                color: "#1a2340",
                                boxShadow: "0 4px 20px rgba(100,120,180,0.18)",
                            }}
                            headStyle={{ color: "#1a2340", borderBottom: "1px solid rgba(100,120,180,0.15)" }}
                        >
                            {Object.entries(hoveredNode)
                                .filter(([k]) => !["highlighted","x","y","size","baseColor","borderColor","borderSize","category","hidden"].includes(k))
                                .map(([key, value]) => (
                                    <div key={key} style={{ fontSize: 12, marginBottom: 2 }}>
                                        <span style={{ fontWeight: 600 }}>{key}:</span> {String(value)}
                                    </div>
                                ))
                            }
                        </Card>
                    </div>
                )}
                {hoveredEdge && (
                    <div style={{position: "absolute", top: 60, left: 16, zIndex: 10}}>
                        <Card
                            size="small"
                            style={{
                                maxWidth: 280, borderRadius: 10,
                                background: "rgba(255,255,255,0.97)",
                                border: "1px solid rgba(100,120,180,0.22)",
                                color: "#1a2340",
                                boxShadow: "0 4px 20px rgba(100,120,180,0.18)",
                            }}
                        >
                            {Object.entries(hoveredEdge?.properties ?? {}).map(([k, v]) => (
                                <div key={k} style={{ fontSize: 12, marginBottom: 2 }}>
                                    <span style={{ fontWeight: 600 }}>{k}:</span> {String(v)}
                                </div>
                            ))}
                        </Card>
                    </div>
                )}

                {/* Node details panel */}
                {selectedNodeId && (
                    <div style={{position: "absolute", top: 60, left: 16, zIndex: 10}}>
                        <Card
                            size="small"
                            title={<span>Node {selectedNodeId}</span>}
                            style={{
                                maxWidth: 280, borderRadius: 10,
                                background: "rgba(255,255,255,0.97)",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                            headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                        >
                            <Descriptions column={1} items={getNodeDetails()}/>
                        </Card>
                    </div>
                )}

                {/* Back button */}
                <div style={{position: "absolute", top: 16, left: 16, zIndex: 10}}>
                    <Button
                        type="primary"
                        icon={<LeftOutlined/>}
                        size="large"
                        shape="circle"
                        onClick={onHighLevelViewClick}
                    />
                </div>
                {retrievedAt && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                            zIndex: 15,
                            background: "rgba(255,255,255,0.95)",
                            border: "1px solid rgba(100,120,180,0.18)",
                            padding: "6px 10px",
                            borderRadius: 8,
                            fontSize: 12,
                            color: "#4a5580",
                            fontWeight: 500,
                            boxShadow: "0 2px 6px rgba(100,120,180,0.12)"
                        }}
                    >

                        {retrievedAt}
                    </div>
                )}
            </div>
        </div>

    );
};

export default LowLevelGraphVisualization;
