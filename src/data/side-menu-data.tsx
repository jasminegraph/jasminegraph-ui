import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  FundProjectionScreenOutlined,
  PartitionOutlined,
  ContainerOutlined,
  ReadOutlined,
  RadarChartOutlined,
  InfoCircleOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import * as Routes from "../routes/page-routes";

export type SideMenuItem = Required<MenuProps>["items"][number];

export const getSideMenuData = (router: AppRouterInstance) => {
  const onMenuClick = (key: string) => {
    router.push(key);
  };

  const sideMenuData: SideMenuItem[] = [
    {
      key: Routes.SIDE_MENU_ROUTES.home,
      icon: <ContainerOutlined />,
      label: "Database Information",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.home);
      },
    },
    {
      key: Routes.SIDE_MENU_ROUTES.clusterPage,
      icon: <AppstoreOutlined />,
      label: "Clusters",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.clusterPage);
      },
    },
    {
      key: Routes.SIDE_MENU_ROUTES.graphPanel,
      icon: <RadarChartOutlined />,
      label: "Graph Panel",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.graphPanel);
      },
    },
    {
      key: Routes.SIDE_MENU_ROUTES.queryInterface,
      icon: <FundProjectionScreenOutlined />,
      label: "Query Interface",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.queryInterface);
      },
    },
    {
      key: Routes.SIDE_MENU_ROUTES.queryExecution,
      icon: <PartitionOutlined />,
      label: "Query Execution",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.queryExecution);
      },
    },
    {
      key: Routes.SIDE_MENU_ROUTES.querySubmission,
      icon: <BookOutlined />,
      label: "Query Submission",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.querySubmission);
      },
    },
    {
      key: Routes.SIDE_MENU_ROUTES.guides,
      icon: <ReadOutlined />,
      label: "Guides",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.guides);
      },
    },
    {
      key: Routes.SIDE_MENU_ROUTES.settings,
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.settings);
      },
    },
    {
      key: Routes.SIDE_MENU_ROUTES.about,
      icon: <InfoCircleOutlined />,
      label: "About",
      onClick: () => {
        onMenuClick(Routes.SIDE_MENU_ROUTES.about);
      },
    },
    // {
    //   key: '3',
    //   icon: <SettingOutlined />,
    //   label: 'Navigation Three',
    //   children: [
    //     { key: '31', label: 'Option 1' },
    //   ],
    // },
    // {
    //   key: '2',
    //   icon: <AppstoreOutlined />,
    //   label: 'Clusters',
    //   children: [
    //     { key: '21', label: 'Option 1' },
    //     {
    //       key: '23',
    //       label: 'Submenu',
    //       children: [
    //         { key: '231', label: 'Option 1' },
    //       ],
    //     },
    //     {
    //       key: '24',
    //       label: 'Submenu 2',
    //       children: [
    //         { key: '241', label: 'Option 1' },
    //       ],
    //     },
    //   ],
    // },
  ];
  return sideMenuData;
};
