# System Design : Rate Limiters

A production-grade distributed API rate limiting system with a real-time load simulator dashboard, built using React, Node.js, Express, Redis, and Socket.IO.

This project demonstrates how modern backend systems implement and enforce rate limiting using Redis and industry-standard algorithms, while providing a frontend simulator to generate real traffic and visualize limiter behavior in real time.

This repository serves both as:

* A production-ready rate limiter implementation
* A real-time rate limiter testing and visualization platform
* A reference architecture for distributed rate limiting systems


# Table of Contents

* Overview
* Architecture
* Tech Stack
* Rate Limiting Strategies
* System Components
* Frontend Simulator
* Backend Implementation
* Redis Integration
* Real-Time Monitoring
* Installation
* Running the Project
* API Endpoints
* Project Structure
* How Rate Limiting Works
* Production Considerations
* License


# Overview

Modern APIs must protect themselves from abuse, overload, and malicious traffic. This project implements a distributed rate limiting system using Redis and provides a simulator to test limiter behavior under real load conditions.

The system includes:

* Redis-based distributed limiter
* Multiple limiter strategies
* Real-time monitoring via Socket.IO
* Load simulator capable of generating high request throughput
* Professional frontend dashboard for visualization


# Architecture

High-level system flow:

Client Simulator → Express Server → Redis → Limiter Decision → Response → Real-Time Update → Frontend Dashboard

Detailed flow:

1. Frontend simulator sends HTTP requests
2. Express middleware checks Redis limiter state
3. Redis validates request allowance
4. Request is allowed or blocked
5. Server emits real-time limiter event via Socket.IO
6. Frontend updates dashboard instantly


# Tech Stack

Frontend:

* React 19
* Vite
* TailwindCSS
* shadcn/ui
* Zustand
* Axios
* Socket.IO client
* Recharts

Backend:

* Node.js
* Express.js
* Redis
* rate-limiter-flexible
* Socket.IO
* MongoDB (optional logging)
* Winston logger

Infrastructure:

* Redis for distributed limiter state
* WebSockets for real-time monitoring


# Rate Limiting Strategies Implemented

This project supports multiple industry-standard rate limiting algorithms.


## Token Bucket

Concept:

A bucket contains tokens representing allowed requests. Each request consumes a token. Tokens refill over time.

Example:

100 tokens maximum
Refill rate: 10 tokens per second

Advantages:

* Allows burst traffic
* Smooth request handling
* Widely used in production

Redis implementation concept:

```js
const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100,
  duration: 60,
});
```


## Fixed Window

Concept:

Limits requests within fixed time windows.

Example:

100 requests per minute

Advantages:

* Simple implementation
* Low overhead

Disadvantage:

* Allows burst at window boundaries


## Sliding Window

Concept:

Tracks requests continuously instead of fixed intervals.

Advantages:

* More accurate limiting
* Prevents burst abuse

Redis uses sorted sets internally.


## Distributed Rate Limiting

Redis ensures limiter state consistency across multiple servers.

This enables:

* Horizontal scaling
* Load balancer compatibility
* Cluster-safe limiting


# System Components

Frontend:

* Simulator dashboard
* Load generator
* Real-time charts
* Event log viewer

Backend:

* Express server
* Limiter middleware
* Redis limiter engine
* Socket.IO event emitter

Redis:

* Stores limiter state
* Tracks request consumption
* Handles limiter resets


# Frontend Simulator

The simulator generates configurable load against backend endpoints.

Capabilities:

* Configure requests per second
* Configure total requests
* Configure concurrency level
* Select HTTP method
* Monitor allowed and blocked requests
* View real-time limiter state

Simulator engine tracks:

* Requests sent
* Requests allowed
* Requests blocked
* Requests failed
* Average response time

Example simulator flow:

```js
setInterval(() => {
  sendRequestBatch();
}, 1000);
```


# Backend Implementation

Limiter middleware example:

```js
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "api",
  points: 100,
  duration: 60,
  blockDuration: 60,
});

const limiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({
      error: "Rate limit exceeded"
    });
  }
};
```

Limiter workflow:

1. Request arrives
2. Redis checks available points
3. Request allowed or blocked
4. Limiter state updated


# Redis Integration

Redis stores limiter state using keys:

Example:

```
rate_limit:user_ip
```

Redis enables:

* Fast lookup
* Distributed consistency
* Persistence
* High performance


# Real-Time Monitoring

Socket.IO provides live limiter feedback.

Server emits events:

```js
io.emit("rate-limit-event", {
  allowed: true,
  remaining: 45
});
```

Frontend listens and updates dashboard instantly.


# Installation

Clone repository:

```bash
git clone <repository-url>
cd api-rate-limiters
```

Install backend:

```bash
cd server
pnpm install
```

Install frontend:

```bash
cd client
pnpm install
```


# Running the Project

Start Redis:

```bash
redis-server
```

Start backend:

```bash
cd server
pnpm run dev
```

Start frontend:

```bash
cd client
pnpm run dev
```

Open:

```
http://localhost:5173
```


# API Endpoints

Health check:

```
GET /health
```

Test endpoint:

```
GET /api/test
```

Limiter status:

```
GET /api/rate-limit/status
```


# Project Structure

```
client/
  src/
    pages/
    components/
    services/
    store/

server/
  middlewares/
  routes/
  services/
  configs/
```


# How Rate Limiting Works

1. Client sends request
2. Express middleware intercepts
3. Redis checks limiter state
4. Request allowed or blocked
5. State updated
6. Frontend receives real-time update


# Production Considerations

This architecture supports:

* Horizontal scaling
* Load balancers
* Distributed systems
* High throughput APIs

Recommended production improvements:

* Redis cluster
* Monitoring dashboard
* Role-based limiter
* Dynamic limiter configuration


# Use Cases

* API protection
* Authentication protection
* Public API limiting
* SaaS platform infrastructure
* Backend engineering reference


# License

ISC License
