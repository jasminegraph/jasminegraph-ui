"use client";
import React from "react";
import MainHeader from "./header/header";
import MainWrapper from "./main-wrapper";
import { Layout } from "antd";
import SideMenu from "./menu/side-menu";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MainWrapper>
      <Layout>
        <MainHeader />
        <Layout>
          <SideMenu />
          {children}
        </Layout>
      </Layout>
      <MainHeader />
    </MainWrapper>
  );
};

export default PageWrapper;
