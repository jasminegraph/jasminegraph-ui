#!/bin/bash

# Stop script on error
set -e

# Define image names
FRONTEND_IMAGE_NAME="jasminegraph-frontend"
BACKEND_IMAGE_NAME="jasminegraph-backend"

# Build the frontend Docker image
echo "Building frontend Docker image..."
docker build -t $FRONTEND_IMAGE_NAME ./frontend
echo "Frontend Docker image built successfully: $FRONTEND_IMAGE_NAME"

# Build the backend Docker image
echo "Building backend Docker image..."
docker build -t $BACKEND_IMAGE_NAME ./backend
echo "Backend Docker image built successfully: $BACKEND_IMAGE_NAME"

echo "All Docker images built successfully!"