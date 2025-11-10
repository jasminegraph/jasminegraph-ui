# Use your prebuilt Playwright test image
FROM jasminegraph/jasminegraph-ui-tests-prerequisites:latest

WORKDIR /app

# Copy in your test suite
COPY . .

# Ensure Playwright browsers are installed
RUN npx playwright install

# Run tests
CMD ["npx", "playwright", "test"]

