"use client";
import React, { useState, useEffect } from "react";
import { Layout, message, theme, Typography } from "antd";
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

  const getAllCluster = async () => {
    try{
    const res = await getAllClusters(userData._id);
    if(res.data){
      setClusters(res.data)
    }
    }catch(err){
      message.error("Failed to fetch clusters");
    }
  }

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

  const handleOnClusterClick = (cluster: IClusterDetails) => {
    dispatch(set_Selected_Cluster(cluster))
    router.push(`/clusters/${cluster._id}`)
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
            <Search
              placeholder="search..."
              allowClear
              size="large"
              onSearch={onSearch}
              style={{ width: 300 }}
            />
          </div>
          <Col>
          {clusters.length > 0 ? 
          clusters.map((cluster, index) => (
            <Row key={index}>
              <Card hoverable style={{width: "100%", marginBottom: "20px", border: "1px solid gray"}}
              onClick={() => handleOnClusterClick(cluster)}
              >
                <Typography>
                  <Title level={3}>{cluster.name}</Title>
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Text>
                      Cluster ID: {cluster._id}
                    </Text>
                    {/* <Text>Owner: {cluster.clusterOwner}</Text> */}
                    <Text>Cration Date: {cluster.createdAt}</Text> 
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
        </Content>
      </Layout>
    </PageWrapper>
  );
}
