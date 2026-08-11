FROM node:20-alpine

# Build the frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build the backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Expose port and start
EXPOSE 5001
CMD ["npm", "run", "dev"]
