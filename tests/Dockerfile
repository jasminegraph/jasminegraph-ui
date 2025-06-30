# Use the official Playwright image (includes Chromium, Firefox, WebKit, Node.js)
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory inside the container
WORKDIR /app

# Copy package.json and lock file to install dependencies
COPY package.json package-lock.json ./

# Install test dependencies
RUN npm install

# Copy all test files into the container
COPY . .

# Install Playwright browser dependencies
RUN npx playwright install --with-deps

# Default command to run all tests
CMD ["npx", "playwright", "test"]
