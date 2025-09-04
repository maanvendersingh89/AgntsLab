# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy server dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server + shared code
COPY server/ ./server/
COPY shared/ ./shared/

EXPOSE 5000

CMD ["npm", "start"]
