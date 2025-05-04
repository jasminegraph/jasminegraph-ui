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
