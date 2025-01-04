/**
Copyright 2024 JasminGraph Team
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
