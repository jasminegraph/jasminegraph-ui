/**
 Copyright 2024 JasmineGraph Team
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
import SegmentedProgress from "@/components/extract-panel/progress-bar";
const { Search } = Input;
const { Title, Text } = Typography;
import React, {useEffect, useState} from "react";
import {InboxOutlined, LoadingOutlined} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
    Button,
    Col,
    Divider,
    message,
    Row,
    Typography,
    Upload,
    Modal,
    Input, Card, Spin,
} from "antd";
import kafkaLOGO from "@/assets/images/kafka-logo.jpg";
import hadoopLOGO from "@/assets/images/hadoop-logo.jpg";
import Image from "next/image";
import KafkaUploadModal from "@/components/graph-panel/kafka-upload-modal";
import HadoopUploadModal from "@/components/graph-panel/hadoop-upload-modal";
import { RcFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import axios from "axios";
import HadoopExtractModal from "@/components/extract-panel/hadoop-extract-modal";
import ClusterRegistrationForm from "@/components/cluster-details/cluster-registration-form";
import type {SearchProps} from "antd/es/input/Search";
import {GRAPH_TYPES, GraphType} from "@/data/graph-data";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {IOption} from "@/types/options-types";
import {getGraphList} from "@/services/graph-service";
import {add_degree_data, add_query_result, add_upload_bytes, add_visualize_data} from "@/redux/features/queryData";
import {useAppDispatch, useAppSelector} from "@/redux/hook";

const { Dragger } = Upload;
interface IKnowledgeGraph {
    _id: string;
    name: string;
    createdAt: string;
    progress: number;
}

const WS_URL = "ws://localhost:8080";

interface IUploadBytes {
    graphId: string;
    uploaded: number;
    total: number;
    percentage: number;
    triplesPerSecond?: number; // new
    bytesPerSecond?: number;   // new
    startTime?: string
}

type ISocketResponse = {
    type: string,
    clientId?: string
}
export default function GraphUpload() {
    const [kafkaModalOpen, setKafkaModelOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const [hadoopModalOpen, setHadoopModelOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File>();
    const [fileUrl, setFileUrl] = useState<string>();
    const [modalOpen, setModalOpen] = useState(false);
    const [graphName, setGraphName] = useState<string>("");
    const [showUploadSection, setShowUploadSection] = useState<boolean>(false);
    const [graphs, setGraphs] = useState<IKnowledgeGraph[]>([]); // existing graphs
    const [filteredGraphs, setFilteredGraphs] = useState<IKnowledgeGraph[]>([]); // existing graphs
    const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(WS_URL, {    share: true, shouldReconnect: (closeEvent) => true });
    const [clientId, setClientID] = useState<string>('')
    const uploadBytesGraphs  = useAppSelector((state) => state.queryData.uploadBytes);

    const [searchValue, setSearchValue] = useState<string>("");
    const formatSize = (bytes : number) => {
        if (bytes < 1024) {
            return `${bytes.toFixed(0)} Bytes`;
        } else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        } else if (bytes < 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        }
    };

    const handleFileUpload = (file: RcFile) => {
        setModalOpen(true);
        setFile(file);

        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
        }

        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
        } else {
            setFileUrl(undefined);
        }
        return false;
    };

    const stopUploadBytesStream = async () =>{
        console.log("stopUploadBytesStream readyState: ", readyState);
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage(
                {
                    type: "STOP",
                    clientId: clientId,
                    clusterId: localStorage.getItem("selectedCluster")
                }
            );
        }
    }


    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('graphName', graphName); // Append the file name

        // Send the file and filename with Axios POST request
        axios.post('/backend/graph/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                message.success("File uploaded successfully");
            })
            .catch(error => {
                message.error("Failed to upload file");
            });

        setModalOpen(false);
    };

    const handleExtractGraphButtonClick = async () => {
        // if(!showUploadSection){
            stopUploadBytesStream()
        // }
        setShowUploadSection(true);

    }

//     useEffect(() => {
// if(!hadoopModalOpen){
//     if (showUploadSection){
//         setShowUploadSection(false);
//     }
// }
// // if (hadoopModalOpen){
// //     stopUploadBytesStream();
// // }
//
//
//     }, [hadoopModalOpen]);


    useEffect(() => {
        const message = lastJsonMessage as ISocketResponse;
        console.log("124", message);
        if(!message) return;
        setLoading(false);
        if(message?.type == "CONNECTED"){
            setClientID(message?.clientId || '')
        }else {
            console.log(message);
            dispatch(add_upload_bytes({ ...message}));
            // stopUploadBytesStream()
        }
    }, [lastJsonMessage])
    // useEffect(() => {
    //
    //     // setLoading(true);
    //
    //         if (readyState === ReadyState.OPEN) {
    //             sendJsonMessage(
    //                 {
    //                     type: "UPBYTES",
    //                     graphIds: [],
    //                     clientId: clientId,
    //                     clusterId: localStorage.getItem("selectedCluster")
    //                 }
    //             );
    //         }
    //
    //
    //
    //     const fetchGraphs = async () => {
    //         // Replace with your backend API call
    //         const fetchedGraphs: IKnowledgeGraph[] = [
    //             { _id: "1", name: "Graph A :/home/textA.txt", createdAt: "2025-10-01", progress: 40 },
    //             { _id: "2", name: "Graph B :/home/textB.txt", createdAt: "2025-09-25", progress: 75 },
    //         ];
    //         setGraphs(fetchedGraphs);
    //     };
    //     fetchGraphs();
    // }, [readyState, clientId, hadoopModalOpen]);

    useEffect(() => {
        // if(showUploadSection) return;
        if(hadoopModalOpen) return;
        if (showUploadSection) return;

        setLoading(true);
        const interval = setInterval(() => {
            console.log("Sending periodic UPBYTES");
            // Send UPBYTES
            sendJsonMessage({
                type: "UPBYTES",
                graphIds: [],
                clientId: clientId,
                clusterId: localStorage.getItem("selectedCluster")
            });

            // Then send STOP after a short delay

        }, 1000); // repeat every 5 seconds

        return () => {
            clearInterval(interval);
            // stopUploadBytesStream(); // also ensure cleanup
        };

    }, [clientId, readyState , showUploadSection, hadoopModalOpen]);

//     useEffect(() => {
//
//         // setLoading(true);
// if(showUploadSection) return;
//         if (readyState === ReadyState.OPEN) {
//             sendJsonMessage(
//                 {
//                     type: "UPBYTES",
//                     graphIds: [],
//                     clientId: clientId,
//                     clusterId: localStorage.getItem("selectedCluster")
//                 }
//             );
//         }
//
// // setShowUploadSection(false);
//
//         // const fetchGraphs = async () => {
//         //     // Replace with your backend API call
//         //     const fetchedGraphs: IKnowledgeGraph[] = [
//         //         { _id: "1", name: "Graph A :/home/textA.txt", createdAt: "2025-10-01", progress: 40 },
//         //         { _id: "2", name: "Graph B :/home/textB.txt", createdAt: "2025-09-25", progress: 75 },
//         //     ];
//         //     setGraphs(fetchedGraphs);
//         // };
//         // fetchGraphs();
//     },[readyState, clientId , showUploadSection]);
    const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
        const filteredClusters = graphs.filter((cluster) => {
            return cluster.name.toLowerCase().includes(value.toLowerCase());
        });
        setFilteredGraphs(filteredClusters);
    }
    // useEffect(() => {
    //     return () => {
    //         console.log("un mounting");
    //         stopUploadBytesStream();
    //     };
    // }, []);
    return (
        <>      <Spin spinning={loading} indicator={<LoadingOutlined spin />} fullscreen />

            {(showUploadSection || (uploadBytesGraphs && uploadBytesGraphs.updates.length==0)) &&  <div className="graph-upload-panel">
                <Typography.Title level={4} style={{ margin: "20px 0px" }}>
                    Extract Graph Data:
                </Typography.Title>
                <Dragger
                    multiple={false}
                    maxCount={1}
                    beforeUpload={(file: RcFile) => handleFileUpload(file)}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                </Dragger>
                <Modal
                    title="Extract Graph"
                    centered
                    open={modalOpen}
                    onOk={() => setModalOpen(false)}
                    onCancel={() => setModalOpen(false)}
                    styles={{ footer: { display: "none" } }}
                >
                    <div className="flex whitespace-nowrap gap-4 mt-5">
                        <div>Graph Name:</div>
                        <Input
                            value={graphName}
                            onChange={(event) => setGraphName(event.currentTarget.value)}
                        />
                    </div>
                    <Button
                        type="primary"
                        style={{ margin: "20px 0px", width: "100%" }}
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                </Modal>
                <Button
                    type="primary"
                    style={{ margin: "20px 0px", width: "100%" }}
                    onClick={() => setModalOpen(true)}
                >
                    Upload
                </Button>
                <Divider>or</Divider>
                <Row className="external-upload">
                    <Col xs={20} sm={16} md={12} lg={12} xl={12}>
                        <div className="upload-card" onClick={() => setKafkaModelOpen(true)}>
                            <Image src={kafkaLOGO} width={200} alt="Apache Kafka" />
                        </div>
                    </Col>
                    <Col xs={20} sm={16} md={12} lg={12} xl={12}>
                        <div className="upload-card" onClick={() => setHadoopModelOpen(true)}>
                            <Image src={hadoopLOGO} width={200} alt="Hadoop HDFS" />
                        </div>
                    </Col>
                </Row>
                <KafkaUploadModal
                    open={kafkaModalOpen}
                    setOpen={(state: boolean) => setKafkaModelOpen(state)}
                />
                <HadoopExtractModal
                    open={hadoopModalOpen}
                    setOpen={(state: boolean) => {
                        setShowUploadSection(state);
                        setHadoopModelOpen(state)}}
                />

            </div>}
            { !showUploadSection && uploadBytesGraphs.updates.length > 0 &&  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <Typography>
                    <Title level={2}> On Progress Extraction</Title>
                </Typography>
                <div style={{gap: "10px", display: "flex"}}>
                    <Search
                        placeholder="search..."
                        allowClear
                        size="large"
                        onSearch={onSearch}
                        style={{ width: 300 }}
                    />
                    <Button size="large" onClick={()=> setShowUploadSection(true)}>Extract New Graph</Button>
                    {/*<Modal*/}
                    {/*    title="Connect New Cluster"*/}
                    {/*    open={openModal}*/}
                    {/*    footer={<></>}*/}
                    {/*    onCancel={() => setOpenModal(false)}*/}
                    {/*>*/}
                    {/*    <ClusterRegistrationForm onSuccess={afterClusterRegistration}/>*/}
                    {/*</Modal>*/}
                </div>
            </div>}
            {
                !showUploadSection && uploadBytesGraphs && uploadBytesGraphs.updates.length > 0 &&

                uploadBytesGraphs.updates.map((upload : IUploadBytes, index) => ( upload.percentage !=100?
                    // <Row key={index}>
                    //     <Card hoverable style={{width: "100%", marginBottom: "20px", border: "1px solid gray"}}
                    //     >
                    //         <Typography>
                    //             <div style={{display: "flex", justifyContent: "space-between"}}>
                    //                 {/*<Title level={3} onClick={() => handleOnClusterClick(cluster)}>{cluster.name}</Title>*/}
                    //                 {/*<Button color="primary" type="default" onClick={() => handleOnClusterSelect(cluster)}>*/}
                    //                 {/*    Select*/}
                    //                 {/*</Button>*/}
                    //             </div>
                    //             <div style={{display: "flex", justifyContent: "space-between"}}>
                    //                 <Text>
                    //                     Cluster ID: {cluster._id}
                    //                 </Text>
                    //                 <Text>Creation Date: {cluster.createdAt}</Text>
                    //             </div>
                    //         </Typography>
                    //     </Card>
                    // </Row>

                        <Card
                            key={index}
                            hoverable
                            style={{
                                width: "100%",
                                marginBottom: "20px",
                                border: "1px solid gray",
                                borderRadius: "10px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                        >
                            <Typography>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Text strong> Graph Id: {upload.graphId}</Text>
                                    <Text type="secondary">{upload.percentage.toFixed(2)}%</Text>
                                </div>

                                <div style={{ marginTop: "10px" }}>
                                    <SegmentedProgress progress={upload.percentage} segments={50} />
                                </div>

                                {/* Uploaded vs Total Size */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "8px",
                                    fontSize: "14px"
                                }}>
                                    <Text type="secondary">
                                        Uploaded: {formatSize(upload.uploaded)}
                                    </Text>
                                    <Text type="secondary">
                                        Total: {formatSize(upload.total)}
                                    </Text>
                                </div>

                                {/* Triples/sec and Bytes/sec */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "4px",
                                    fontSize: "14px"
                                }}>
                                    <Text type="secondary">
                                        Triples/sec: {upload.triplesPerSecond?.toLocaleString() || 0}
                                    </Text>
                                    <Text type="secondary">
                                        Bytes/sec: {(upload.bytesPerSecond ? (upload.bytesPerSecond / (1024 * 1024)).toFixed(2) : 0)} MB/s
                                    </Text>
                                </div>

                                {/* Start Time */}
                                {upload.startTime && (
                                    <div style={{
                                        marginTop: "4px",
                                        fontSize: "14px",
                                        textAlign: "right"
                                    }}>
                                        <Text type="secondary">
                                            Start Time: {upload.startTime}
                                        </Text>
                                    </div>
                                )}
                            </Typography>
                        </Card>
                        :null
                ))
            }
        </>
    );
}
