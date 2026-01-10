# Use the prebuilt backend prerequisites image
FROM jasminegraph/jasminegraph-ui-backend-prerequisites:20251129T095426

WORKDIR /app

# Copy only the source code (not package.json again)
COPY . .

RUNnpm install pdf-parse@1.1.1 pdfjs-dist@2.16.105

# Run the app
CMD ["npm", "start"]
