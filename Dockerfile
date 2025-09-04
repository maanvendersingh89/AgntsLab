# Build stage
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy full source
COPY . .

# Compile TS -> dist
RUN npm run build

# Verify dist exists
RUN ls -la /app/dist

# Production stage
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]
