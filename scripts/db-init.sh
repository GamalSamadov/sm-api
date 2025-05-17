#!/bin/bash

# Initialize PostgreSQL database and run migrations
echo "🗄️ Initializing PostgreSQL Database"
echo "=================================="

# Start the database container
echo "🚀 Starting PostgreSQL container..."
docker-compose up -d postgres

# Check if the container started successfully
if [ $? -ne 0 ]; then
  echo "❌ Failed to start PostgreSQL container. Exiting."
  exit 1
fi

# Wait for PostgreSQL to initialize
echo "⏳ Waiting for PostgreSQL to initialize..."
sleep 5

# Run database migrations
echo "📝 Running database migrations..."
npm run db:migrate

if [ $? -ne 0 ]; then
  echo "❌ Failed to run database migrations. Check the logs for details."
  exit 1
fi

echo "✅ Database initialization complete!"
echo "You can now run the API with: npm run dev"
