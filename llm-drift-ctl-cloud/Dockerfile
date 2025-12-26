FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production=false

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (can be overridden by PORT env var)
EXPOSE 8080

# Start server
CMD ["npm", "start"]

