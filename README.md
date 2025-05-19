# 🎓 Student Management System API

RESTful API of my final project of the bootcamp Computer-science on the Hsoub academy📚✨

## ✨ Features

- 🔄 Complete CRUD operations for students and lessons
- 🔗 Associate students with lessons easily
- 🔐 UUID-based identifiers for enhanced security and distribution
- 🐳 PostgreSQL database with Docker support for easy deployment

## 🛠️ Prerequisites

- 📦 Node.js (v14 or higher)
- 🐳 Docker and Docker Compose
- 📦 npm or 🐰 bun

## 🔧 Technologies and Design Patterns

### Core Technologies

- **TypeScript**: Strongly-typed JavaScript for better developer experience and code quality
- **Express.js**: Fast, unopinionated web framework for Node.js
- **PostgreSQL**: Advanced open-source relational database
- **Docker**: Containerization for consistent development and deployment environments

### Design Patterns

- **MVC Architecture**: Model-View-Controller pattern for clear separation of concerns
    - Models: Data structures and validation
    - Controllers: Request handling and response formatting
    - Services: Business logic implementation
- **Repository Pattern**: Data access abstraction layer to separate business logic from data access

    - Centralized data access logic
    - Easily swappable data sources
    - Improved testability

- **Dependency Injection**: Loose coupling between components for better modularity and testing

    - Services injected into controllers
    - Repositories injected into services

- **RESTful API Design**: Industry standard for building scalable and stateless web services
    - Resource-based routes
    - HTTP methods for CRUD operations
    - Clear endpoint structure

### Development Practices

- **Environment-based Configuration**: Separate configurations for development and production
- **Database Migrations**: Version-controlled database schema changes
- **Containerization**: Docker-based deployment for consistent environments

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/GamalSamadov/sm-server.git
cd sm-server
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. 🗄️ Set up the database

Initialize the PostgreSQL database in Docker and run migrations:

```bash
# Initialize the database
npm run db:init
```

This will:

- Start the PostgreSQL container
- Run all database migrations
- Set up the schema with UUID support

Alternatively, you can start the database and run migrations separately:

```bash
npm run db:start   # Start PostgreSQL container
npm run db:migrate # Run migrations
```

### 4. 🏃‍♂️ Run the server

In development mode with auto-reload:

```bash
npm run dev
```

The API will be available at `http://localhost:4200` by default.

### 5. 🔌 API Endpoints

#### 👨‍🎓 Students

- `GET /api/students` - Get all students 📋
- `GET /api/students/:id` - Get a student by ID 🔍
- `POST /api/students` - Add a new student ➕
- `PUT /api/students` - Update a student 🔄
- `DELETE /api/students/:id` - Delete a student ❌

#### 📚 Lessons

- `GET /api/lessons` - Get all lessons 📋
- `GET /api/lessons/:id` - Get a lesson by ID 🔍
- `POST /api/lessons` - Add a new lesson ➕
- `PUT /api/lessons` - Update a lesson 🔄
- `DELETE /api/lessons/:id` - Delete a lesson ❌

## 🔧 Database Management

- `npm run db:start` - Start the database 🚀
- `npm run db:stop` - Stop the database 🛑
- `npm run db:migrate` - Run migrations 🔄
- `npm run db:reset` - Reset database (delete all data and run migrations) 🗑️

## 👨‍💻 Development

The project uses TypeScript and follows a layered architecture:

- 🎮 **Controllers**: Handle HTTP requests/responses
- ⚙️ **Services**: Implement business logic
- 🗄️ **Repositories**: Interact with the database
- 📝 **Models**: Define data structures

## 🔄 Database Connection

If you experience connection issues, make sure:

1. 🔌 PostgreSQL is running on port 5434 (to avoid conflicts)
2. 🔐 The credentials match those in your .env file
3. 🧪 Run `npm run db:test` to verify connectivity

For local development, your database connection details should be:

```
Host: localhost
Port: 5434
User: postgres
Password: postgres
Database: student_management
```

### 🐋 Deployment Methods

The simplest way to deploy with Docker:

```bash
# Build and start all services
docker-compose up -d

# Check service logs
docker-compose logs -f api

# Stop all services
docker-compose down
```

### 🚀 Using the Deployment Script

For a more streamlined deployment experience:

```bash
# Run the deployment script
npm run deploy
# or directly
./scripts/deploy.sh
```

This will:

- Build the Docker images
- Start the services
- Run migrations
- Verify that everything is working correctly

### 🔧 Environment Configuration

The Docker deployment uses these default environment variables:

- `NODE_ENV`: production
- `DB_HOST`: postgres (Docker service name)
- `DB_PORT`: 5432
- `DB_USER`: postgres
- `DB_PASSWORD`: postgres
- `DB_NAME`: student_management

You can override these in the docker-compose.yml file if needed.

### 📝 Advanced Docker Configuration

For more advanced Docker setups, you can:

1. **Modify docker-compose.yml**:

    - Add services like Redis for caching
    - Set up reverse proxy with Nginx
    - Configure persistent volumes

2. **Customize Dockerfile**:

    - Change base image
    - Optimize build steps
    - Add health checks

3. **Configure for production**:
    - Set up Docker Swarm or Kubernetes
    - Configure load balancing
    - Set up monitoring with Prometheus/Grafana

## 📋 Project Structure

```
.
├── 📂 src/
│   ├── 📄 server.ts         # Application entry point
│   ├── 📄 db.ts             # Database connection manager
│   ├── 📂 controller/       # Request handlers
│   ├── 📂 service/          # Business logic
│   ├── 📂 repositories/     # Data access
│   ├── 📂 models/           # Data structures
│   ├── 📂 migrations/       # Database schema updates
│   └── 📂 routes/           # API endpoint definitions
├── 📂 scripts/              # Scripts for deployment and initialization
│   ├── 📄 deploy.sh         # Deployment script
│   └── 📄 db-init.sh        # Database initialization script
├── 📄 docker-compose.yml    # Container configuration
├── 📄 Dockerfile            # Docker image configuration
└── 📄 package.json          # Project dependencies
```

⭐ **Star this repository if you find it useful!** ⭐
