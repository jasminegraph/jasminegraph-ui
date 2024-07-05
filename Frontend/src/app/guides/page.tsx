"use client";
import React from "react";
import { Layout, theme, Tabs } from "antd";
import PageWrapper from "@/layouts/page-wrapper";
import AboutJasmine from "@/components/guides/about-jasmine";

const { Content } = Layout;

const tabItems = [
{
  label: 'About JasmineGraph',
  key: '1',
  children: <AboutJasmine />,
},
{
  label: 'Get Started',
  key: '2',
  children: 'Content of Tab Pane 2',
},
{
  label: 'Concept',
  key: '3',
  children: 'Content of Tab Pane 3',
},
{
  label: 'Index and Search',
  key: '4',
  children: 'Content of Tab Pane 4',
},
{
  label: 'Component',
  key: '5',
  children: 'Content of Tab Pane 5',
},
{
  label: 'Deploy',
  key: '6',
  children: 'Content of Tab Pane 6',
},
{
  label: 'Operation',
  key: '7',
  children: 'Content of Tab Pane 7',
},
{
  label: 'Develop',
  key: '8',
  children: 'Content of Tab Pane 8',
},
{
  label: 'Release Note',
  key: '9',
  children: 'Content of Tab Pane 9',
}
]



export default function Guides() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChange = (key: string) => {
    console.log(key);
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
          <Tabs
            tabPosition="right"
            onChange={onChange}
            type="card"
            items={tabItems}
          />
        </Content>
      </Layout>
    </PageWrapper>
  );
}
