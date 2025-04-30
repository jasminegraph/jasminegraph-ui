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
import React, { useState, useEffect, use } from "react";
import { Button, Divider, Layout, message, Modal, theme, Typography } from "antd";
import PageWrapper from "@/layouts/page-wrapper";
import { Input } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { Card, Col, Row } from "antd";
import { useRouter } from "next/navigation";
import { IClusterDetails } from "@/types/cluster-types";
import { useDispatch } from "react-redux";
import { set_Selected_Cluster } from "@/redux/features/clusterData";
import { getAllClusters } from "@/services/cluster-service";
import { useAppSelector } from "@/redux/hook";
import ClusterRegistrationForm from "@/components/cluster-details/cluster-registration-form";

const { Search } = Input;
const { Content } = Layout;
const { Title, Text } = Typography;
export default function Clusters() {
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const { userData } = useAppSelector((state) => state.authData);
  const [clusters, setClusters] = useState<IClusterDetails[]>([]);
  const [filteredClusters, setFilteredClusters] = useState<IClusterDetails[]>([]);

  const { selectedCluster } = useAppSelector((state) => state.clusterData);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const getAllCluster = async () => {
    try{
    const res = await getAllClusters(userData._id);
    if(res.data){
      setClusters(res.data)
    }
    }catch(err){
      message.error("Failed to fetch JasmineGraph clusters");
    }
  }

  const setSelecterCluster = () => {
    if(localStorage.getItem("selectedCluster")){
      const selectedCluster = clusters.find((cluster) => cluster._id == localStorage.getItem("selectedCluster"));
      if(selectedCluster)
      dispatch(set_Selected_Cluster(selectedCluster));
    }
  }

  useEffect(() => {
    setSelecterCluster();
  }, [clusters])


  useEffect(() => {
    if(userData._id){
      getAllCluster();
    }
  }, [])

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    const filteredClusters = clusters.filter((cluster) => {
      return cluster.name.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredClusters(filteredClusters);
  }

  const handleOnClusterSelect = (cluster: IClusterDetails) => {
    dispatch(set_Selected_Cluster(cluster))
    localStorage.setItem("selectedCluster", cluster._id);
  }

  const handleOnClusterClick = (cluster: IClusterDetails) => {
    handleOnClusterSelect(cluster);
    router.push(`/clusters/${cluster._id}`)
  }

  const showModal = () => {
    setOpenModal(true);
  }

  const afterClusterRegistration = () => {
    setOpenModal(false);
    getAllCluster();
  }
  

  return (
    <PageWrapper>
      <Layout style={{ padding: "24px 24px", height: "92vh" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <Typography>
              <Title level={2}>My Clusters</Title>
            </Typography>
            <div style={{gap: "10px", display: "flex"}}>
              <Search
                placeholder="search..."
                allowClear
                size="large"
                onSearch={onSearch}
                style={{ width: 300 }}
              />
              <Button size="large" onClick={showModal}>Add New Cluster</Button>
              <Modal
                title="Connect New Cluster"
                open={openModal}
                footer={<></>}
                onCancel={() => setOpenModal(false)}
              >
                <ClusterRegistrationForm onSuccess={afterClusterRegistration}/>
              </Modal>
            </div>
          </div>
          {selectedCluster && (
            <>
              <Divider>Selected Cluster</Divider>
              <Col>
                  <Row key={selectedCluster._id}>
                    <Card hoverable style={{width: "100%", marginBottom: "20px", border: "1px solid gray"}}
                    onClick={() => handleOnClusterClick(selectedCluster)}
                    >
                      <Typography>
                        <Title level={3}>{selectedCluster.name}</Title>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                          <Text>
                            Cluster ID: {selectedCluster._id}
                          </Text>
                          <Text>Creation Date: {selectedCluster.createdAt}</Text> 
                        </div>
                      </Typography>
                    </Card>
                  </Row>
              </Col>  
            </>
          )}
          {clusters.filter((item) => selectedCluster == null || (item._id !== selectedCluster?._id)).length > 0 && (
            <>
              <Divider>All Clusters</Divider>
              <Col>
                {clusters.length > 0 ? 
                clusters.filter((item) => selectedCluster == null || (item._id !== selectedCluster?._id)).map((cluster, index) => (
                  <Row key={index}>
                    <Card hoverable style={{width: "100%", marginBottom: "20px", border: "1px solid gray"}}
                    >
                      <Typography>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Title level={3} onClick={() => handleOnClusterClick(cluster)}>{cluster.name}</Title>
                        <Button color="primary" type="default" onClick={() => handleOnClusterSelect(cluster)}>
                          Select
                        </Button>
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                          <Text>
                            Cluster ID: {cluster._id}
                          </Text>
                          <Text>Creation Date: {cluster.createdAt}</Text> 
                        </div>
                      </Typography>
                    </Card>
                  </Row>
                  )):(
                  <div className="flex justify-center items-center h-full">
                  No Clusters Found
                  </div>
                )}
              </Col>
            </>
          )}
        </Content>
      </Layout>
    </PageWrapper>
  );
}
