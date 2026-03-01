# Stage 1: Build React frontend
FROM node:20 AS frontend

WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build FastAPI backend
FROM python:3.13-slim

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# Copy frontend build into backend static folder
COPY --from=frontend /app/frontend/dist ./static

# Expose port (DigitalOcean uses $PORT)
ENV PORT=8080

EXPOSE 8080

# Run FastAPI with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]