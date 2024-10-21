# Base image used  
FROM node:alpine 

# Set the working directory inside the container  
WORKDIR /app  

# Copy package.json and package-lock.json to the container  
COPY package*.json ./  

# Install dependencies  
RUN npm ci  

# Copy the app source code to the container  
COPY . .  

# Install project dependencies
RUN npm install

# Build arguments
ARG MONGO_HOST
ARG MONGO_PORT
ARG DB_NAME=jasmine

# Set environment variables
ENV MONGO_HOST=$MONGO_HOST
ENV MONGO_PORT=$MONGO_PORT
ENV DB_NAME=$DB_NAME

# Running default command
CMD ["npm", "start"]