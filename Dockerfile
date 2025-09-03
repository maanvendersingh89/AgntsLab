# Build stage for client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy server files
COPY package*.json ./
COPY server/ ./server/
COPY shared/ ./shared/

# Copy built client files to server
COPY --from=client-build /app/client/dist ./server/public

# Install server dependencies
RUN npm ci --only=production

EXPOSE 5000

CMD ["npm", "start"]