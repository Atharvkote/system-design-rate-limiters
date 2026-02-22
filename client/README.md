# Rate Limiter Simulator

Production-grade frontend for testing and visualizing API rate limiting behavior in real time.

## Tech Stack

- React 19
- Vite
- TailwindCSS
- shadcn/ui (Radix primitives)
- Socket.IO client
- Axios
- Zustand
- Recharts

## Quick Start

1. Ensure the backend is running on port 5000: `pnpm run dev` (from project root)
2. Start the simulator: `pnpm run dev`
3. Open http://localhost:5173
4. Navigate to **Simulator** and configure your target URL (default: `http://localhost:5000/api/v1/public/info`)
5. Click **Start Simulation**

## Features

- **High-throughput requests**: Batched scheduling supports 100+ RPS without freezing the browser
- **Simulation modes**: Constant, Burst, Spike
- **Real-time stats**: Total sent, allowed, blocked, failed, current RPS
- **Live charts**: Line chart (requests over time), Bar chart (allowed vs blocked)
- **Event logs**: Scrollable log with color-coded entries (max 500)
- **Socket.IO**: Real-time limiter status when backend emits telemetry
- **Safe controls**: Start/Stop/Reset with proper state management

## Project Structure

```
src/
├── pages/          Simulator, Dashboard
├── components/     simulator/*, ui/*
├── services/       apiClient, socketService, simulatorEngine
├── store/          simulatorStore (Zustand)
├── hooks/          useSimulator, useSocket
└── utils/          requestBatcher, timeUtils
```

## Backend Integration

The simulator infers **blocked** from HTTP 429 responses. For richer telemetry (remaining tokens, reset time), the backend should emit Socket.IO events:

- `rate-limit-event` / `rateLimit:action`
- `rate-limit-blocked`
- `rate-limit-allowed`
- `rate-limit-status`
