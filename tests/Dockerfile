# Use your prebuilt Playwright test image
FROM pavanikarunarathna21/jasminegraph-ui-tests-prerequisites:latest

WORKDIR /app

# Copy in your test suite
COPY . .

# All dependencies & browsers are already in the base image
CMD ["npx", "playwright", "test"]

