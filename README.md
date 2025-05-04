# jasminegraph-ui

Web based User Interface for [JasmineGraph](https://github.com/miyurud/jasminegraph) Distributed Graph Database Server

## Overview

jasminegraph-ui is a web-based user interface for interacting with the JasmineGraph Distributed Graph Database Server. This application is built using Next.js to provide a responsive and efficient frontend experience.

## Features

- User-friendly interface for managing graph databases.
- Visual representation of graph data.
- Efficient querying and manipulation of graph data.
- Integration with JasmineGraph backend services.

## Prerequisites

- Node.js (>= 12.x.x)
- npm (>= 6.x.x)
- mongoDB (>=v7.0.14) (follow this [guide](https://www.mongodb.com/docs/manual/administration/install-community/))
- Docker (optional, if you prefer to run using Docker)


### Running the Application Locally

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


# JasmineGraph Docker Deployment

This guide will help you set up and deploy JasmineGraph using Docker. We’ll build the frontend and backend services separately, then use Docker Compose to bring everything up.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)

## Deployment Instructions

1. **Clone the Repository**

   Clone the JasmineGraph repository:

   ```bash
   git clone https://github.com/jasminegraph/jasminegraph-ui.git
   cd jasminegraph
   ```

2. **Build the Frontend Service**

   Navigate to the `Frontend` directory and build the Docker image:

   ```bash
   cd Frontend
   docker build -t jasminegraph-frontend .
   ```

3. **Build the Backend Service**

   Navigate to the `Backend` directory and build the Docker image:

   ```bash
   cd Backend
   docker build -t jasminegraph-backend .
   ```

4. **Start the Services with Docker Compose**

   From the root directory of the project, use Docker Compose to start both the frontend and backend services:

   ```bash
   cd ..
   docker compose up
   ```

   This command will start all the services defined in your `docker-compose.yml` file.

5. **Access the Application**

   Once the containers are running, you can access JasmineGraph through the specified frontend and backend endpoints.

## Stopping the Services

To stop the services, press `Ctrl+C` in the terminal running `docker compose up`, or run:

```bash
docker compose down
```

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
