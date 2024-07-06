"use client";
import React, { useState } from "react";
import { Layout, theme, Typography } from "antd";
import PageWrapper from "@/layouts/page-wrapper";
import { Input } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { Card, Col, Row } from "antd";
import { ClusterData } from "@/data/cluster-data";
import { useRouter } from "next/navigation";
import { IClusterDetails } from "@/types/cluster-types";

const { Search } = Input;
const { Content } = Layout;
const { Title, Text } = Typography;
export default function Clusters() {
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [clusters, setClusters] = useState<IClusterDetails[]>(ClusterData);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    const filteredClusters = ClusterData.filter((cluster) => {
      return cluster.name.toLowerCase().includes(value.toLowerCase());
    });
    setClusters(filteredClusters);
  }

  const handleOnClusterClick = (clusterID: string) => {
    router.push(`/clusters/${clusterID}`)
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
              onClick={() => handleOnClusterClick(cluster.clusterId)}
              >
                <Typography>
                  <Title level={3}>{cluster.name}</Title>
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Text>Version: {cluster.version}</Text>
                    <Text>Cration Date: {cluster.creationDate}</Text> 
                    <Text>
                      Cluster ID: {cluster.clusterId}
                    </Text>
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
