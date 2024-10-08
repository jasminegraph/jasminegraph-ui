"use client";
import React, { useEffect } from "react";
import { Layout, Spin, theme } from "antd";
import PageWrapper from "@/layouts/page-wrapper";
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import * as Routes from "@/routes/page-routes";

const { Content } = Layout;

export default function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();

  useEffect(() => {
    router.push(Routes.SIDE_MENU_ROUTES.clusterPage);
  }, []);

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
          className="flex items-center justify-center"
        >
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Content>
      </Layout>
    </PageWrapper>
  );
}
