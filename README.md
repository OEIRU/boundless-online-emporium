
# WildStore - Online E-commerce Platform

A modern e-commerce platform built with React, Node.js, and MongoDB, containerized using Docker.

## Features

- Responsive product catalog with categories
- Product search and filtering
- Shopping cart functionality
- User authentication
- Wishlist management
- Order processing and management
- Admin dashboard (coming soon)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine

### Running the Application

1. Clone the repository:
   ```
   git clone <repository-url>
   cd wildstore
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api

## Project Structure

```
.
├── src/                 # Frontend React application
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages
│   ├── services/        # API services
│   └── utils/           # Utility functions
├── server/              # Backend Node.js API
│   ├── src/             # API source code
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   └── index.js     # API entry point
│   └── Dockerfile       # Backend Dockerfile
├── Dockerfile           # Frontend Dockerfile
├── docker-compose.yml   # Docker Compose configuration
├── nginx.conf           # Nginx configuration for frontend
└── README.md            # Project documentation
```

## Development

For local development without Docker:

1. Start the backend:
   ```
   cd server
   npm install
   npm run dev
   ```

2. Start the frontend:
   ```
   npm install
   npm run dev
   ```

## License

This project is licensed under the MIT License.
