# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json + lock and install (with dev deps, needed for tsc)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Compile TypeScript to dist/
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/shared ./shared

EXPOSE 5000

CMD ["npm", "start"]
