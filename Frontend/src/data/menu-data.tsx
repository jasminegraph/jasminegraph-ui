import type { MenuProps } from 'antd';
import { ContainerOutlined, CodeSandboxOutlined,SecurityScanOutlined, AlignLeftOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import * as Routes from "@/routes/page-routes";

type MenuItem = Required<MenuProps>['items'][number];

export const ClusterTopMenu: MenuItem[] = [
  {
    label: 'Cluster Details',
    key: Routes.CLUSTER_PAGE_ROUTES.clusterDetails,
    icon: <ContainerOutlined />,
  },
  {
    label: 'Access Management',
    key: Routes.CLUSTER_PAGE_ROUTES.accessManagement,
    icon: <SecurityScanOutlined />,
  },
  {
    label: 'Instance',
    key: Routes.CLUSTER_PAGE_ROUTES.instance,
    icon: <CodeSandboxOutlined />,
  },
  {
    label: 'Deployment',
    key: Routes.CLUSTER_PAGE_ROUTES.deployment,
    icon: <DeploymentUnitOutlined />,
  },
  {
    label: 'Logs',
    key: Routes.CLUSTER_PAGE_ROUTES.logs,
    icon: <AlignLeftOutlined />,
  },
];

export const GraphPanelMenu: MenuItem[] = [
  {
    label: 'Upload',
    key: Routes.GRAPH_PANEL_ROUTES.upload,
    icon: <ContainerOutlined />,
  },
  {
    label: 'Graph',
    key: Routes.GRAPH_PANEL_ROUTES.graph,
    icon: <CodeSandboxOutlined />,
  },
  {
    label: 'Distribution',
    key: Routes.GRAPH_PANEL_ROUTES.distribution,
    icon: <DeploymentUnitOutlined />,
  },
];

export const QueryInterfaceMenu: MenuItem[] = [
  {
    label: 'Query',
    key: Routes.QUERY_PANEL_ROUTES.query,
    icon: <ContainerOutlined />,
  },
  {
    label: 'Console',
    key: Routes.QUERY_PANEL_ROUTES.console,
    icon: <CodeSandboxOutlined />,
  },
];
