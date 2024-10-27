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

# Running default command
CMD ["npm", "start"]