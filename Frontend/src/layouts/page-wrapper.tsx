"use client";
import React from "react";
import { Layout } from "antd";
import SideMenu from "@/layouts/menu/side-menu";
import MainHeader from "@/layouts/header/header";
import MainWrapper from "@/layouts/main-wrapper";

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
    </MainWrapper>
  );
};

export default PageWrapper;
