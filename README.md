# Vite Node.js Starter Template

   <div align="center">
<img  height="400" width="400" src="https://techstack-generator.vercel.app/react-icon.svg"/>
   </div>


A full-stack starter template for building modern web applications with a React frontend and a Node.js/Express backend. This template provides a solid foundation with essential features like authentication, real-time communication, database integration, and security best practices.

## Features

- **Frontend**: React application built with Vite for fast development and optimized builds
- **Backend**: Node.js server with Express.js, featuring robust middleware and security
- **Database**: MongoDB integration with Mongoose ODM
- **Caching**: Redis for session management and rate limiting
- **Real-time Communication**: Socket.IO for WebSocket support with Redis adapter
- **UI Components**: Pre-configured shadcn/ui components with Tailwind CSS
- **Authentication**: Ready-to-implement authentication system with rate limiting
- **Security**: Helmet for security headers, CORS configuration, and rate limiting
- **Logging**: Winston logger with Loki integration for centralized logging
- **Development Tools**: ESLint, hot reloading, and optimized build processes

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| Vite | 7.2.4 | Build tool and dev server |
| Tailwind CSS | 4.1.17 | Utility-first CSS framework |
| React Router | 7.10.1 | Client-side routing |
| shadcn/ui | Latest | Component library |
| Lucide React | 0.556.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest LTS | Runtime environment |
| Express.js | 5.2.1 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 9.0.1 | ODM for MongoDB |
| Redis | 5.8.2 | In-memory data store |
| Socket.IO | 4.8.1 | Real-time communication |
| Winston | 3.19.0 | Logging library |
| Helmet | 8.1.0 | Security middleware |
| CORS | 2.8.5 | Cross-origin resource sharing |

## Project Structure

```bash
vite-node-starter-template/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── layout/    # Layout components (nav, footer)
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── pages/         # Page components
│   │   │   └── auth/      # Authentication pages
│   │   ├── store/         # State management (placeholder)
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/                 # Node.js backend application
│   ├── configs/           # Database configurations
│   ├── controllers/       # Route controllers (placeholder)
│   ├── middlewares/       # Custom middleware (placeholder)
│   ├── models/            # Database models (placeholder)
│   ├── routers/           # API routes (placeholder)
│   ├── utils/             # Utility functions
│   ├── logs/              # Log files (placeholder)
│   ├── server.js          # Main server file
│   └── package.json
└── README.md              # Project documentation
```

## Installation

### Prerequisites

- Node.js (version 18 or higher)
- MongoDB (local or cloud instance)
- Redis (local or cloud instance)
- pnpm (recommended) or npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vite-node-starter-template
   ```

2. **Install dependencies**

   For the client:
   ```bash
   cd client
   pnpm install
   ```

   For the server:
   ```bash
   cd ../server
   pnpm install
   ```

3. **Environment Configuration**

   Copy the example environment files and configure them:

   Client:
   ```bash
   cd client
   cp .env.example .env
   ```

   Server:
   ```bash
   cd ../server
   cp .env.example .env
   ```

   Update the `.env` files with your configuration:
   - Database connection strings
   - Redis URLs
   - JWT secrets
   - API keys

4. **Start the applications**

   Start the server:
   ```bash
   cd server
   pnpm run dev
   ```

   In a new terminal, start the client:
   ```bash
   cd client
   pnpm run dev
   ```

   The client will be available at `http://localhost:5173` and the server at `http://localhost:5000`.

## Usage

### Development

- **Client**: Run `pnpm run dev` in the `client` directory for hot-reloaded development
- **Server**: Run `pnpm run dev` in the `server` directory for auto-restarting server
- **Linting**: Run `pnpm run lint` in the `client` directory to check code quality

### Production

- **Client**: Run `pnpm run build` to create an optimized production build
- **Server**: Run `pnpm run start` to start the production server

## API Endpoints

The server provides the following default endpoints:

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

Additional API routes can be added in the `server/routers/` directory and mounted in `server.js`.

## Configuration

### Server Configuration

Key environment variables for the server:

- `SERVER_PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection URL
- `NODE_ENV` - Environment (development/production)

### Client Configuration

The client uses Vite's configuration in `client/vite.config.js` with path aliases and Tailwind CSS integration.

## Security Features

- Helmet for security headers
- CORS configuration with allowed origins
- Rate limiting with Redis store
- Input validation and sanitization
- Secure cookie handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
