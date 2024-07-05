import React from "react";
import { Layout, Menu, theme } from "antd";
import { getSideMenuData } from "@/data/side-menu-data";
import { usePathname, useRouter } from "next/navigation";
import * as Routes from "@/routes/page-routes";

const { Sider } = Layout;

const SideMenu = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const pathname = usePathname();
  const sideMenuData = getSideMenuData(useRouter());
  
  const findActiveMenu = () => {
    const path = pathname.split("/")[1];
    return sideMenuData.filter((item) => item?.key === `/${path}`).map((item) => item.key)[0];
  }

  return (
    <Sider width={200} style={{ background: colorBgContainer }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[Routes.SIDE_MENU_ROUTES.home]}
        selectedKeys={[findActiveMenu()]}
        style={{ height: "100%", borderRight: 0 }}
        items={sideMenuData}
      />
    </Sider>
  );
};

export default SideMenu;
