import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import { getSideMenuData } from "@/data/side-menu-data";
import { usePathname, useRouter } from "next/navigation";
import * as Routes from "../../routes/page-routes";

const { Sider } = Layout;

const SideMenu = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const sideMenuData = getSideMenuData(useRouter());
  
  return (
    <Sider width={200} style={{ background: colorBgContainer }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[Routes.SIDE_MENU_ROUTES.home]}
        selectedKeys={[usePathname()]}
        style={{ height: "100%", borderRight: 0 }}
        items={sideMenuData}
      />
    </Sider>
  );
};

export default SideMenu;
