import axios from 'axios';

const GRAFANA_URL = process.env.GRAFANA_URL || 'http://20.40.46.214:3001';
const ADMIN_USER = process.env.GRAFANA_ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.GRAFANA_ADMIN_PASSWORD || 'admin';

const auth = {
  username: ADMIN_USER,
  password: ADMIN_PASSWORD,
};

const prometheusDatasource = {
  name: 'Prometheus',
  type: 'prometheus',
  access: 'proxy',
  url: 'http://prometheus:9090',
  isDefault: true,
};

const dashboardPayload = {
  dashboard: {
    id: null,
    title: "Auto-created Dashboard",
    panels: [],
    schemaVersion: 16,
    version: 0,
  },
  folderId: 0,
  overwrite: true,
};

let grafanaSetupDone = false;
let lastDashboardUID: string | null = null;

async function waitForGrafana(): Promise<void> {
  while (true) {
    try {
      const res = await axios.get(`${GRAFANA_URL}/api/health`, { auth });
      if (res.status === 200) {
        console.log("Grafana is ready");
        break;
      }
    } catch {
      console.log("Waiting for Grafana to be ready...");
    }
    await new Promise(r => setTimeout(r, 3000));
  }
}

async function createDatasource(): Promise<void> {
  try {
    await axios.post(`${GRAFANA_URL}/api/datasources`, prometheusDatasource, { auth });
    console.log("Prometheus datasource created");
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log("Datasource already exists");
    } else {
      console.error("Error creating datasource:", error.message);
    }
  }
}

async function createDashboard(): Promise<string> {
  try {
    const response = await axios.post(`${GRAFANA_URL}/api/dashboards/db`, dashboardPayload, { auth });
    console.log("Dashboard created");
    return response.data.uid;  // get UID from Grafana response
  } catch (error: any) {
    console.error("Error creating dashboard:", error.message);
    throw error;
  }
}

export async function setupGrafana(): Promise<string> {
  if (grafanaSetupDone && lastDashboardUID) {
    console.log('Grafana setup already done, skipping');
    return lastDashboardUID;
  }
  
  await waitForGrafana();
  await createDatasource();
  const uid = await createDashboard();
  grafanaSetupDone = true;
  lastDashboardUID = uid;
  console.log("Grafana setup complete, UID:", uid);
  return uid;
}