#!/bin/bash

# Build and deploy the Student Management API with Docker
echo "🚀 Building and Deploying Student Management API with Docker"
echo "=========================================================="

# Build the application
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Exiting deployment."
  exit 1
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

if [ $? -ne 0 ]; then
  echo "❌ Docker deployment failed. Check the logs for details."
  exit 1
fi

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 5

# Check if the API is running
echo "🔍 Checking if API is running..."
if curl -s http://localhost:4200/health > /dev/null; then
  echo "✅ API is running successfully!"
  echo "📊 API is available at: http://localhost:4200"
  echo "📝 Endpoints:"
  echo "  - /api/students"
  echo "  - /api/lessons"
else
  echo "⚠️ API health check failed. The service might still be starting up."
  echo "📋 Check the logs with: docker-compose logs -f api"
fi

echo "🎉 Deployment process completed!"
