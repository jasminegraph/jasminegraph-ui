"use client";
import React, { useState } from "react";
import PageWrapper from "@/layouts/page-wrapper";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import { QueryInterfaceMenu } from "@/data/menu-data";
import * as Routes from "@/routes/page-routes";
import { useRouter } from "next/navigation";

const { Content } = Layout;
export default function GraphPanelLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [current, setCurrent] = useState(Routes.QUERY_PANEL_ROUTES.query);
  const router = useRouter();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    router.push(Routes.SIDE_MENU_ROUTES.queryInterface + e.key);
  };

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
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={QueryInterfaceMenu}
          />
          {children}
        </Content>
      </Layout>
    </PageWrapper>
  );
}
