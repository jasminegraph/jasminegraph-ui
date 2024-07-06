# jasminegraph-ui

Web based User Interface for JasmineGraph Distributed Graph Database Server

## Overview

jasminegraph-ui is a web-based user interface for interacting with the JasmineGraph Distributed Graph Database Server. This application is built using Next.js to provide a responsive and efficient frontend experience.

## Prerequisites

- Node.js (>= 12.x.x)
- npm (>= 6.x.x) or yarn (>= 1.x.x)
- Docker (optional, if you prefer to run using Docker)

## Installation

Clone the repository:

```bash
git clone https://github.com/jasminegraph/jasminegraph-ui.git
cd jasminegraph-ui/Backend
```

Install dependencies:

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

### Running the Application Locally

To run the application locally, use the following command:

Using npm:

```bash
npm run start
```

Using yarn:

```bash
yarn dev
```

### Building and Running with Docker

To build and run the application using Docker, follow these steps:

1. Ensure Docker is installed and running on your machine.
2. Build the Docker image:

```bash
docker build -t jasminegraph-backend .
```

3. Run the Docker container:

```bash
docker run -p 8080:8080 jasminegraph-backend
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

- Fork the repository.
- Create a new branch with your feature or bugfix.
- Commit your changes.
- Push your branch and create a pull request.

## Contact

For any questions or issues, please open an issue on the GitHub repository or contact the maintainers.
