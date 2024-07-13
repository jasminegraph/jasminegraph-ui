"use client";
import React from "react";
import PageWrapper from "@/layouts/page-wrapper";
import { Layout, theme } from "antd";

const { Content } = Layout;
export default function QueryExecution() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <PageWrapper>
      <Layout style={{ padding: "24px 24px", height: "92vh" }}>
        {/* <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb> */}
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="flex justify-center items-center h-full">
            Query Execution
          </div>
        </Content>
      </Layout>
    </PageWrapper>
  );
}
