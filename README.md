# jasminegraph-ui

Web based User Interface for [JasmineGraph](https://github.com/miyurud/jasminegraph) Distributed Graph Database Server

## Overview

jasminegraph-ui is a web-based user interface for interacting with the JasmineGraph Distributed Graph Database Server. This application is built using Next.js to provide a responsive and efficient frontend experience.

## Features

- User-friendly interface for managing graph databases.
- Visual representation of graph data.
- Efficient querying and manipulation of graph data.
- Integration with JasmineGraph backend services.

# Running the Application Locally

## Prerequisites

- Node.js (>= 12.x.x)
- npm (>= 6.x.x)
- mongoDB (>=v7.0.14) (follow this [guide](https://www.mongodb.com/docs/manual/administration/install-community/))

## Instructions

To run the application locally, use the following command:

Clone the repository:

```bash
git clone https://github.com/jasminegraph/jasminegraph-ui.git
cd jasminegraph-ui
```

Install dependencies:

```bash
cd Frontend
npm install
```

```bash
cd ../Backend
npm install
```

Run Frontend Application:

```bash
cd ../Frontend
npm run dev
```

Run Backend Application in a new terminal

```bash
cd Backend
npm run nodemon
```

Open your browser and navigate to http://localhost:3000 to access the application.

info:
To shutdown close both Frontend and Backend terminals

# JasmineGraph Docker Deployment

This guide will help you set up and deploy JasmineGraph using Docker. We’ll build the frontend and backend services separately, then use Docker Compose to bring everything up.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- Docker-compose (>= 2.36.0)
- Start JasmineGraph Server in Docker mode

## Deployment Instructions

1. **Clone the Repository**

   Clone the JasmineGraph repository:

   ```bash
   git clone https://github.com/jasminegraph/jasminegraph-ui.git
   cd jasminegraph-ui
   ```

2. **Start the Services with Docker Compose**

   From the root directory of the project, use Docker Compose to start both the frontend and backend services:

   ```bash
   docker compose up
   ```

   This command will start all the services defined in your `docker-compose.yml` file.

3. **Access the Application**

Open your browser and navigate to http://localhost:3000 to access the application.

## Stopping the Services

To stop the services, press `Ctrl+C` in the terminal which is occupied by `docker compose up`, or in a new terminal run:

```bash
docker compose down
```

# JasmineGraph UI Kubernetes Deployment

Deploy the same stack (frontend, backend, postgres, keycloak) to a local Kubernetes cluster — works with either **minikube** or **k3s** (k3d too). Structured to match the deployment approach used by the [JasmineGraph server repo](https://github.com/miyurud/jasminegraph): plain `kubectl apply -f` manifests under `k8s/`, hostPath-backed volumes templated with `envsubst`, an `application: jasminegraph-ui` label for bulk cleanup, and a `start-k8s.sh clean` teardown command.

## Prerequisites

- Docker
- `kubectl`
- `envsubst` (GNU gettext; used to template `k8s/volumes.yaml`)
- One of: [minikube](https://minikube.sigs.k8s.io/docs/start/), [k3s](https://docs.k3s.io/quick-start), or [k3d](https://k3d.io/)
- Your cluster running, e.g., `minikube start` (or `k3s` installed as a service / `k3d cluster create`)

## Deploy

```bash
./start-k8s.sh
```

The script auto-detects minikube vs. k3s/k3d, builds the frontend/backend images, loads them into the cluster (no external registry needed), applies the manifests in `k8s/`, waits for every deployment to become ready, and prints the URL to open.

Optional flags (all have defaults):

```bash
./start-k8s.sh --CLUSTER_TYPE minikube \
  --POSTGRES_DATA_PATH "$HOME/jasminegraph-ui-data/postgres" \
  --BACKEND_CACHE_PATH "$HOME/jasminegraph-ui-data/backend-cache"
```

> **minikube note:** hostPath volumes resolve on the *node* (minikube's VM/container), not this machine — the script runs `minikube ssh` to create the data directories there automatically. On k3s/k3d the paths are created directly on the host.

## Tear down

```bash
./start-k8s.sh clean
```

## Notes

- Manifests live under `k8s/` — plain YAML, no kustomize, applied directly via `kubectl apply -f`.
- The Postgres init SQL and Keycloak realm import are loaded into ConfigMaps at deploy time straight from `Backend/src/db-init/` and `Keycloak/jasminegraph-realm.json` — the same files `docker-compose.yml` uses — so there's nothing to keep in sync by hand.
- Credentials in `k8s/secrets.yaml` are dev-only defaults matching `docker-compose.yml`; replace them before using this anywhere beyond a local cluster.
- The Playwright test service isn't included — it's test-only tooling, not part of the running app.
- This deploys into the `default` namespace, same as the JasmineGraph server repo — so both can run on the same local cluster side-by-side without conflicting (resource names differ). The UI's backend connects to the graph server by registering its `jasminegraph-master-service` host/port as a "cluster" in the UI, not through any shared config.

## Deployment Instructions

JasmineGraph UI documentation: [documentation](https://github.com/jasminegraph/jasminegraph-ui/blob/feature/graph_visualization2/JasmineGraph-UI-Documentation.pdf)

## Additional Notes

- Make sure to adjust any configurations as needed in your `docker-compose.yml`.
- If you encounter permission issues, try running the Docker commands with `sudo`.

## Troubleshooting

- Check Docker logs if any service fails to start:

  ```bash
  docker logs <container_name>
  ```

- Ensure no other processes are using the same ports specified in your `docker-compose.yml`.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

- Fork the repository.
- Create a new branch with your feature or bugfix.
- Commit your changes.
- Push your branch and create a pull request.

## Contact

For any questions or issues, please open an issue on the GitHub repository or contact the maintainers.

