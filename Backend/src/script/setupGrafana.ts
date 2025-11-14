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

async function waitForGrafana() {
  while (true) {
    try {
      const res = await axios.get(`${GRAFANA_URL}/api/health`, { auth });
      if (res.status === 200) {
        console.log("[Backend] Grafana is ready!");
        break;
      }
    } catch (err) {
      console.log("[Backend] Grafana not ready, retrying in 3s");
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function createDatasource() {
  try {
    await axios.post(`${GRAFANA_URL}/api/datasources`, prometheusDatasource, { auth });
    console.log("[Backend] Prometheus datasource created.");
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log("[Backend] Prometheus datasource already exists.");
    } else {
      console.error("[Backend] Error creating datasource:", error.message);
      throw error;
    }
  }
}

function createDashboardPayload(prometheusUID: string) {
  return {
    dashboard: {
      id: null,
      uid: null,
      title: "System Performance Dashboard",
      schemaVersion: 16,
      version: 0,
      refresh: "5s",
      timezone: "browser",
      panels: [
        {
          id: 1,
          title: "CPU Usage",
          type: "timeseries",
          datasource: { type: "prometheus", uid: prometheusUID },
          targets: [
            {
              expr: "cpu_usage",
              legendFormat: "CPU Usage",
              refId: "A",
            },
          ],
          gridPos: { x: 0, y: 0, w: 12, h: 8 },
          options: {},
          fieldConfig: {},
        },
        {
          id: 2,
          title: "Thread Count",
          type: "timeseries",
          datasource: { type: "prometheus", uid: prometheusUID },
          targets: [
            {
              expr: "thread_count",
              legendFormat: "Threads",
              refId: "B",
            },
          ],
          gridPos: { x: 12, y: 0, w: 12, h: 8 },
          options: {},
          fieldConfig: {},
        },
      ],
    },
    folderId: 0,
    overwrite: true,
  };
}

async function createDashboard() {
  const datasourcesRes = await axios.get(`${GRAFANA_URL}/api/datasources`, { auth });
  const prometheusDS = datasourcesRes.data.find((ds: any) => ds.name === 'Prometheus');
  if (!prometheusDS) {
    throw new Error("[Backend] Prometheus datasource not found.");
  }
  const payload = createDashboardPayload(prometheusDS.uid);
  const res = await axios.post(`${GRAFANA_URL}/api/dashboards/db`, payload, { auth });
  console.log("[Backend] Dashboard created with UID:", res.data.uid);

  return res.data.uid;
}

export async function setupGrafana(): Promise<string> {
  await waitForGrafana();
  await createDatasource();
  const uid = await createDashboard();
  console.log("[Backend] Setup complete, returning dashboard UID:", uid);
  return uid;
}
