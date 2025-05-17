#!/bin/bash

# Deploy the Student Management API to Google Cloud
echo "🚀 Deploying Student Management API to Google Cloud"
echo "=================================================="

# Generate a package-lock.json file for npm ci compatibility
echo "📦 Generating package-lock.json..."
npm install --package-lock-only

# Build and push the Docker image to Google Container Registry
echo "🐳 Building and pushing Docker image to Google Cloud..."
PROJECT_ID=$(gcloud config get-value project)
IMAGE_NAME="gcr.io/$PROJECT_ID/student-management-api"

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
  echo "❌ Docker build failed. Exiting deployment."
  exit 1
fi

# Push the Docker image to Google Container Registry
echo "📤 Pushing Docker image to Google Container Registry..."
docker push $IMAGE_NAME

if [ $? -ne 0 ]; then
  echo "❌ Failed to push Docker image. Exiting deployment."
  exit 1
fi

# Deploy the service to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy student-management-api \
  --image=$IMAGE_NAME \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production"

if [ $? -ne 0 ]; then
  echo "❌ Deployment to Cloud Run failed. Exiting."
  exit 1
fi

echo "✅ Deployment to Google Cloud completed successfully!"
echo "🌐 Your API is now available at the URL shown above."
