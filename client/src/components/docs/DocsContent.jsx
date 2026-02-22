/**
 * @file components/docs/DocsContent.jsx
 * @description Main documentation content with all sections.
 */

import { useRef, useEffect } from 'react';
import { DocsSection } from './DocsSection.jsx';
import { CodeBlock } from './CodeBlock.jsx';
import { MermaidDiagram } from './MermaidDiagram.jsx';

const LIMITER_MIDDLEWARE_CODE = `// middlewares/userRateLimiter.js
import { RateLimiterRedis } from "rate-limiter-flexible";
import { getRateLimitKey } from "../utils/rateLimitKey.js";

export function createUserLimiter(redisClient, config) {
  const { prefix, points, duration, blockDuration } = config;
  let limiter = null;

  if (redisClient) {
    limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: prefix,
      points,
      duration,
      ...(blockDuration != null && { blockDuration }),
    });
  }

  return (req, res, next) => {
    if (!limiter) return next();
    const key = getRateLimitKey(req);
    limiter
      .consume(key)
      .then(() => next())
      .catch((rej) => {
        if (rej?.remaining === 0 || rej?.msBeforeNext != null) {
          res.status(429).json({
            success: false,
            message: "Too many requests",
            retryAfter: rej?.msBeforeNext ? Math.ceil(rej.msBeforeNext / 1000) : 60,
          });
          return;
        }
        next();
      });
  };
}`;

const RATE_LIMIT_KEY_CODE = `// utils/rateLimitKey.js
export function getRateLimitKey(req) {
  if (req.user?.id) return \`user:\${req.user.id}\`;
  const apiKey = req.get?.("x-api-key") || req.headers?.["x-api-key"];
  if (apiKey) return \`api:\${apiKey}\`;
  return \`ip:\${req.ip || req.socket?.remoteAddress || "unknown"}\`;
}`;

const RATE_LIMIT_CONFIG_CODE = `// configs/rateLimit.config.js
export const LIMIT_READ = { prefix: "rl_read", points: 100, duration: 60 };
export const LIMIT_WRITE = { prefix: "rl_write", points: 30, duration: 60 };
export const LIMIT_AUTH = { prefix: "rl_auth", points: 5, duration: 900, blockDuration: 900 };
export const LIMIT_PUBLIC = { prefix: "rl_public", points: 300, duration: 60 };
export const LIMIT_HEAVY = { prefix: "rl_heavy", points: 2, duration: 300 };`;

const SIMULATOR_ENGINE_CODE = `// services/simulatorEngine.js (simplified)
export async function startSimulation(config, callbacks) {
  const { batchSize, intervalMs } = computeBatchSchedule(
    requestsPerSecond, totalRequests, concurrency
  );

  intervalId = setInterval(() => {
    const toSend = Math.min(batchSize, totalRequests - stats.totalSent);
    for (let i = 0; i < toSend; i++) {
      executeRequest(client, url, method, payload)
        .then((result) => {
          if (result.blocked) stats.totalBlocked++;
          else if (result.success) stats.totalSuccess++;
          else stats.totalFailed++;
          onStatsUpdate(stats);
        });
    }
  }, intervalMs);
}`;

const SOCKET_LIMITER_CODE = `// socket/connectionHandler.js
socket.on("chat:message", (payload, callback) => {
  checkSocketRateLimit(socketLimiters, socket, "chat:message",
    () => {
      socket.emit("error", { message: "Rate limit exceeded", code: "RATE_LIMIT" });
      callback?.({ error: "Rate limit exceeded" });
    },
    () => callback?.({ ok: true })
  );
});`;

const ADAPTIVE_LIMITER_CODE = `// services/adaptiveLimiter.js
export class AdaptiveLimiter {
  constructor(redis, baseConfig) {
    this.redis = redis;
    this.baseConfig = baseConfig;
    this.metrics = new Map();
  }

  async adjustLimits(userId, metrics) {
    const { errorRate, latency, throughput } = metrics;
    
    // If error rate is high, reduce limits
    if (errorRate > 0.5) {
      return {
        ...this.baseConfig,
        points: Math.floor(this.baseConfig.points * 0.7),
      };
    }
    
    // If latency is low and throughput is high, increase slightly
    if (latency < 100 && throughput > 0.8) {
      return {
        ...this.baseConfig,
        points: Math.floor(this.baseConfig.points * 1.1),
      };
    }
    
    return this.baseConfig;
  }

  async consume(key, points = 1) {
    const config = await this.adjustLimits(key);
    return this.limiter.consume(key, points);
  }
}`;

const SENSITIVITY_TUNING_CODE = `// configs/sensitivityProfiles.js
export const SENSITIVITY_PROFILES = {
  STRICT: {
    apiLimit: { points: 10, duration: 60 },
    authLimit: { points: 3, duration: 300, blockDuration: 600 },
    dataLimit: { points: 5, duration: 60 },
    description: 'Ultra-restrictive. For high-security APIs.',
  },
  NORMAL: {
    apiLimit: { points: 100, duration: 60 },
    authLimit: { points: 5, duration: 300, blockDuration: 900 },
    dataLimit: { points: 50, duration: 60 },
    description: 'Default. Balanced between user experience and security.',
  },
  RELAXED: {
    apiLimit: { points: 500, duration: 60 },
    authLimit: { points: 10, duration: 600, blockDuration: 1800 },
    dataLimit: { points: 200, duration: 60 },
    description: 'Permissive. For internal APIs or trusted clients.',
  },
  CUSTOM: {
    apiLimit: { points: 0, duration: 0 }, // User-defined
    authLimit: { points: 0, duration: 0 },
    dataLimit: { points: 0, duration: 0 },
    description: 'Custom configuration per use case.',
  },
};`;

const RATE_LIMIT_RESPONSE_CODE = `// responses/rateLimitResponse.js
export function buildRateLimitHeaders(rejection) {
  return {
    'X-RateLimit-Limit': rejection.limit,
    'X-RateLimit-Remaining': Math.max(0, rejection.remaining),
    'X-RateLimit-Reset': rejection.resetTime,
    'Retry-After': rejection.msBeforeNext ? Math.ceil(rejection.msBeforeNext / 1000) : 60,
  };
}

export function buildRateLimitBody(rejection) {
  return {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please try again later.',
    retryAfter: Math.ceil(rejection.msBeforeNext / 1000),
    remaining: Math.max(0, rejection.remaining),
  };
}`;

const ARCH_DIAGRAM = `graph TD
    subgraph Client
        Simulator[Client Simulator]
        Browser[Browser UI]
    end
    
    subgraph Server
        Express[Express Server]
        SocketIO[Socket.IO]
    end
    
    subgraph Data
        Redis[(Redis)]
        MongoDB[(MongoDB)]
    end
    
    Simulator -->|HTTP| Express
    Browser -->|WebSocket| SocketIO
    Express --> Redis
    Express --> MongoDB
    SocketIO --> Redis`;

const FLOW_DIAGRAM = `sequenceDiagram
    participant C as Client
    participant E as Express
    participant R as Redis
    
    C->>E: Request
    E->>R: consume(key)
    alt Within limit
        R-->>E: OK, remaining
        E->>C: 200 OK
    else Exceeded
        R-->>E: Rejected
        E->>C: 429 Too Many Requests
    end`;

export function DocsContent({ registerSection }) {
  return (
    <div className="flex-1 min-w-0 space-y-12">
      <DocsSection id="overview" title="Overview" ref={(el) => registerSection?.('overview', el)}>
        <p className="text-muted-foreground mb-4">
          Rate limiting protects APIs from abuse by restricting the number of requests a client can make in a given time window.
          This project implements a production-grade rate limiter with Redis-backed state, per-user and per-endpoint limits,
          and a real-time simulator for testing.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2">Why Rate Limiting?</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>Prevent DDoS and brute-force attacks</li>
          <li>Ensure fair usage across clients</li>
          <li>Protect backend resources from overload</li>
          <li>Comply with API quotas and SLAs</li>
        </ul>
      </DocsSection>

      <DocsSection id="architecture" title="System Architecture" ref={(el) => registerSection?.('architecture', el)}>
        <p className="text-muted-foreground mb-4">
          The system consists of a React frontend simulator, Express backend, Redis for limiter state, and Socket.IO for real-time events.
        </p>
        <MermaidDiagram chart={ARCH_DIAGRAM} title="High-level architecture" />
      </DocsSection>

      <DocsSection id="frontend-arch" title="Frontend Simulator Architecture" ref={(el) => registerSection?.('frontend-arch', el)}>
        <p className="text-muted-foreground mb-4">
          The simulator uses a batched request engine to generate load without blocking the browser.
          Requests are scheduled via <code className="bg-muted px-1 rounded">setInterval</code>, with configurable RPS, concurrency, and total requests.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li><strong>simulatorEngine.js</strong> — Batches requests, tracks stats, emits events</li>
          <li><strong>apiClient.js</strong> — Axios-based client with structured result (success/blocked/failed)</li>
          <li><strong>socketService.js</strong> — Socket.IO connection and rate-limit event subscription</li>
          <li><strong>simulatorStore.js</strong> — Zustand store for stats, logs, chart data</li>
        </ul>
      </DocsSection>

      <DocsSection id="backend-arch" title="Backend Architecture" ref={(el) => registerSection?.('backend-arch', el)}>
        <p className="text-muted-foreground mb-4">
          The backend uses <strong>rate-limiter-flexible</strong> with Redis. Each route can have its own limiter profile (points, duration, blockDuration).
          Keys are derived from <code className="bg-muted px-1 rounded">x-user-id</code>, <code className="bg-muted px-1 rounded">x-api-key</code>, or IP.
        </p>
        <MermaidDiagram chart={FLOW_DIAGRAM} title="Request flow with rate limiter" />
      </DocsSection>

      <DocsSection id="redis" title="Redis Integration" ref={(el) => registerSection?.('redis', el)}>
        <p className="text-muted-foreground mb-4">
          Redis stores limiter state per key. Keys follow the pattern <code className="bg-muted px-1 rounded">{'{prefix}'}:{'{identity}'}</code>.
          The rate-limiter-flexible library uses Lua scripts for atomic consume operations.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li><strong>points</strong> — Max requests (tokens) per window</li>
          <li><strong>duration</strong> — Window size in seconds</li>
          <li><strong>blockDuration</strong> — Optional cooldown after limit exceeded</li>
        </ul>
      </DocsSection>

      <DocsSection id="strategies" title="Rate Limiting Strategies" ref={(el) => registerSection?.('strategies', el)}>
        <p className="text-muted-foreground mb-4">
          Different algorithms trade off burst handling, memory, and accuracy. This project uses a sliding-window style via rate-limiter-flexible.
        </p>
      </DocsSection>

      <DocsSection id="token-bucket" title="Token Bucket" ref={(el) => registerSection?.('token-bucket', el)}>
        <p className="text-muted-foreground mb-4">
          A bucket holds tokens. Each request consumes one. Tokens refill at a fixed rate. Allows bursts up to bucket capacity.
        </p>
        <p className="text-sm text-muted-foreground"><strong>Pros:</strong> Allows bursts. <strong>Cons:</strong> More state to track.</p>
      </DocsSection>

      <DocsSection id="leaky-bucket" title="Leaky Bucket" ref={(el) => registerSection?.('leaky-bucket', el)}>
        <p className="text-muted-foreground mb-4">
          Requests enter a queue; they "leak" out at a fixed rate. Smooths traffic but can add latency.
        </p>
        <p className="text-sm text-muted-foreground"><strong>Pros:</strong> Predictable output rate. <strong>Cons:</strong> Can delay requests.</p>
      </DocsSection>

      <DocsSection id="fixed-window" title="Fixed Window" ref={(el) => registerSection?.('fixed-window', el)}>
        <p className="text-muted-foreground mb-4">
          Count requests in fixed time windows (e.g. per minute). Simple but can allow 2× limit at window boundaries.
        </p>
        <p className="text-sm text-muted-foreground"><strong>Pros:</strong> Simple. <strong>Cons:</strong> Boundary burst.</p>
      </DocsSection>

      <DocsSection id="sliding-window" title="Sliding Window" ref={(el) => registerSection?.('sliding-window', el)}>
        <p className="text-muted-foreground mb-4">
          Count requests in a rolling window. More accurate than fixed window. rate-limiter-flexible uses a variant of this.
        </p>
        <p className="text-sm text-muted-foreground"><strong>Pros:</strong> Accurate, no boundary burst. <strong>Cons:</strong> More computation.</p>
      </DocsSection>

      <DocsSection id="distributed" title="Distributed Rate Limiting" ref={(el) => registerSection?.('distributed', el)}>
        <p className="text-muted-foreground mb-4">
          With Redis, multiple server instances share the same limiter state. Keys are consistent across nodes.
        </p>
      </DocsSection>

      <DocsSection id="socket-limiter" title="Socket.IO Rate Limiting" ref={(el) => registerSection?.('socket-limiter', el)}>
        <p className="text-muted-foreground mb-4">
          Socket events (e.g. chat:message, chat:typing) are rate-limited per user/socket. On exceed, the server emits an error
          and does not process the event. Limiters use Redis with the same pattern as HTTP.
        </p>
        <CodeBlock code={SOCKET_LIMITER_CODE} language="javascript" />
      </DocsSection>

      <DocsSection id="code-examples" title="Code Examples" ref={(el) => registerSection?.('code-examples', el)}>
        <p className="text-muted-foreground mb-4">
          Real code from this project.
        </p>
      </DocsSection>

      <DocsSection id="limiter-middleware" title="Limiter Middleware" ref={(el) => registerSection?.('limiter-middleware', el)}>
        <p className="text-muted-foreground mb-4">
          User-based HTTP limiter with Redis. Fails open when Redis is unavailable.
        </p>
        <CodeBlock code={LIMITER_MIDDLEWARE_CODE} language="javascript" />
        <h4 className="text-base font-semibold mt-6 mb-2">Rate limit key</h4>
        <CodeBlock code={RATE_LIMIT_KEY_CODE} language="javascript" />
        <h4 className="text-base font-semibold mt-6 mb-2">Limit config</h4>
        <CodeBlock code={RATE_LIMIT_CONFIG_CODE} language="javascript" />
      </DocsSection>

      <DocsSection id="simulator-engine" title="Simulator Engine" ref={(el) => registerSection?.('simulator-engine', el)}>
        <p className="text-muted-foreground mb-4">
          The engine batches requests per interval, tracks success/blocked/failed, and updates the store. No blocking loops.
        </p>
        <CodeBlock code={SIMULATOR_ENGINE_CODE} language="javascript" />
      </DocsSection>

      <DocsSection id="rate-limiter" title="Rate Limiter Configuration" ref={(el) => registerSection?.('rate-limiter', el)}>
        <p className="text-muted-foreground mb-4">
          Rate limiters control request flow using configurable parameters. The key parameters are <code className="bg-muted px-1 rounded">points</code> (request quota),
          <code className="bg-muted px-1 rounded">duration</code> (time window), and optional <code className="bg-muted px-1 rounded">blockDuration</code> (cooldown after exceeding).
          Multiple limiters can be chained per route to implement tiered rate limiting.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2">Key Configuration Parameters</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
          <li><strong>points:</strong> Number of allowed requests per time window. Example: 100 requests.</li>
          <li><strong>duration:</strong> Time window in seconds over which points reset. Example: 60 seconds.</li>
          <li><strong>blockDuration:</strong> Optional penalty duration in seconds after limit exceeded. Example: 900 seconds (15 minutes).</li>
          <li><strong>keyPrefix:</strong> Redis key prefix for organizing limits. Example: "rl_write", "rl_auth".</li>
          <li><strong>storeClient:</strong> Redis client for distributed state management across servers.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-6 mb-2">Example Configurations</h3>
        <p className="text-sm text-muted-foreground mb-2">Standard read limit:</p>
        <p className="text-sm font-mono bg-muted p-2 rounded mb-4">100 points per 60 seconds (1.67 req/sec)</p>
        <p className="text-sm text-muted-foreground mb-2">Strict authentication limit with block:</p>
        <p className="text-sm font-mono bg-muted p-2 rounded">5 points per 900 seconds (0.0055 req/sec) + 15 min block</p>
        <p className="text-sm text-muted-foreground mt-4">This prevents brute-force attacks by locking out the attacker temporarily.</p>
      </DocsSection>

      <DocsSection id="sensitivity" title="Sensitivity Tuning" ref={(el) => registerSection?.('sensitivity', el)}>
        <p className="text-muted-foreground mb-4">
          Rate limit sensitivity refers to how aggressively the system restricts traffic. Different applications require different sensitivities
          based on threat level, user experience requirements, and infrastructure capacity. Sensitivity profiles provide preset configurations
          for common use cases.
        </p>
        <CodeBlock code={SENSITIVITY_TUNING_CODE} language="javascript" />
        <h3 className="text-lg font-semibold mt-6 mb-2">Profile Overview</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>STRICT:</strong> 10 API calls/min, 3 auth attempts/5min. Use for sensitive endpoints like password reset.</li>
          <li><strong>NORMAL:</strong> 100 API calls/min, 5 auth attempts/5min. Default for most endpoints.</li>
          <li><strong>RELAXED:</strong> 500 API calls/min, 10 auth attempts/10min. For internal APIs and trusted partners.</li>
          <li><strong>CUSTOM:</strong> Define your own limits per endpoint and user type.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-6 mb-2">Choosing a Sensitivity Profile</h3>
        <p className="text-muted-foreground mb-2">Select based on your threat model:</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Public APIs with anonymous access → STRICT or NORMAL</li>
          <li>Internal APIs with trusted users → RELAXED</li>
          <li>Authentication endpoints → STRICT (always)</li>
          <li>Data export endpoints → STRICT or NORMAL</li>
          <li>Read-heavy endpoints → NORMAL or RELAXED</li>
        </ul>
      </DocsSection>

      <DocsSection id="advanced-strategies" title="Advanced Rate Limiting Strategies" ref={(el) => registerSection?.('advanced-strategies', el)}>
        <p className="text-muted-foreground mb-4">
          Beyond basic per-user limits, advanced strategies handle complex scenarios like user tiers, burst allowances, and adaptive limits.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">User Tier-Based Limiting</h3>
        <p className="text-muted-foreground mb-2">
          Assign different limits based on user subscription level or account age. Premium users get higher quotas.
        </p>
        <div className="bg-muted p-4 rounded text-sm font-mono text-muted-foreground mb-4 overflow-auto">
          Free: 10 req/min | Pro: 100 req/min | Enterprise: 1000 req/min
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Burst Allowance</h3>
        <p className="text-muted-foreground mb-2">
          Permit temporary burst of traffic by increasing the bucket capacity above the steady-state rate.
        </p>
        <div className="bg-muted p-4 rounded text-sm font-mono text-muted-foreground mb-4 overflow-auto">
          Token bucket: 100 tokens, refill 10/sec, max burst 150 tokens
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Adaptive Rate Limiting</h3>
        <p className="text-muted-foreground mb-2">
          Dynamically adjust limits based on server health, error rates, and user behavior. Strict during high load, relaxed during low load.
        </p>
        <CodeBlock code={ADAPTIVE_LIMITER_CODE} language="javascript" />

        <h3 className="text-lg font-semibold mt-6 mb-2">Cost-Based Limiting</h3>
        <p className="text-muted-foreground mb-2">
          Different endpoints cost different amounts. Complex queries cost more points than simple reads.
        </p>
        <div className="bg-muted p-4 rounded text-sm font-mono text-muted-foreground overflow-auto">
          GET /users: 1 point | POST /analytics/export: 50 points | DELETE /batch: 100 points
        </div>
      </DocsSection>

      <DocsSection id="response-handling" title="Rate Limit Response Headers" ref={(el) => registerSection?.('response-handling', el)}>
        <p className="text-muted-foreground mb-4">
          Standard HTTP headers inform clients about their rate limit status and when they can retry. This improves client-side handling.
        </p>
        <CodeBlock code={RATE_LIMIT_RESPONSE_CODE} language="javascript" />
        <h3 className="text-lg font-semibold mt-6 mb-2">Standard Headers</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><code className="bg-muted px-1 rounded">X-RateLimit-Limit</code> — Total request quota for the window</li>
          <li><code className="bg-muted px-1 rounded">X-RateLimit-Remaining</code> — Requests left in current window</li>
          <li><code className="bg-muted px-1 rounded">X-RateLimit-Reset</code> — Unix timestamp when limit resets</li>
          <li><code className="bg-muted px-1 rounded">Retry-After</code> — Seconds to wait before retrying (HTTP 429)</li>
        </ul>
        <h3 className="text-lg font-semibold mt-6 mb-2">Response Body</h3>
        <p className="text-muted-foreground mb-2">Include structured error information in the response body for programmatic handling:</p>
        <div className="bg-muted p-4 rounded text-sm font-mono text-muted-foreground overflow-auto">
          {`{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests",
  "retryAfter": 45,
  "remaining": 0
}`}
        </div>
      </DocsSection>

      <DocsSection id="implementation-best-practices" title="Implementation Best Practices" ref={(el) => registerSection?.('implementation-best-practices', el)}>
        <h3 className="text-lg font-semibold mt-6 mb-2">1. Fail Open on Storage Failure</h3>
        <p className="text-muted-foreground mb-4">
          If Redis is unavailable, allow requests through rather than blocking all traffic. Log the failure and alert operations.
          Degraded service is better than complete outage.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">2. Use Consistent Key Derivation</h3>
        <p className="text-muted-foreground mb-4">
          Keys must be consistent across all servers. Derive from user ID (authenticated) or API key before falling back to IP.
          This prevents attackers from bypassing limits via IP spoofing.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">3. Log Rate Limit Events</h3>
        <p className="text-muted-foreground mb-4">
          Track who triggered limits and why. This data helps identify attacks, misconfigured clients, and legitimate users hitting limits.
          Use structured logging with user ID, endpoint, and timestamp.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">4. Monitor Limit Distribution</h3>
        <p className="text-muted-foreground mb-4">
          Graph how many users/IPs are hitting limits per time period. Spikes may indicate attacks or legitimate usage patterns.
          Use metrics to tune limits.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">5. Separate Limits by Endpoint Type</h3>
        <p className="text-muted-foreground mb-4">
          Authentication, read, write, and export endpoints have different risk profiles. Apply appropriate limits to each.
          Do not use a single global limit for all endpoints.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">6. Communicate Limits to Clients</h3>
        <p className="text-muted-foreground mb-4">
          Document limits in API docs. Return limit info in response headers. Provide clear error messages so clients can understand
          why they are blocked and when they can retry.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">7. Use Exponential Backoff in Clients</h3>
        <p className="text-muted-foreground mb-4">
          When a client receives a 429, it should wait before retrying. Exponential backoff (wait 1s, then 2s, then 4s, etc.)
          prevents thundering herd when limits reset.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">8. Test Rate Limits Before Production</h3>
        <p className="text-muted-foreground mb-4">
          Use the simulator or load testing tools to verify limits work as expected. Test both happy path and failure cases.
          Ensure legitimate users are not blocked.
        </p>
      </DocsSection>

      <DocsSection id="common-patterns" title="Common Rate Limiting Patterns" ref={(el) => registerSection?.('common-patterns', el)}>
        <h3 className="text-lg font-semibold mt-6 mb-2">API Gateway Pattern</h3>
        <p className="text-muted-foreground mb-4">
          Centralize all rate limiting at the API gateway (e.g., reverse proxy). This protects backend services from overload
          and simplifies backend code. Downside: less granular per-endpoint control.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Per-Endpoint Pattern</h3>
        <p className="text-muted-foreground mb-4">
          Apply middleware to individual routes. Allows fine-grained control per endpoint. More code duplication.
          Best for APIs with varied endpoint sensitivities.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Two-Tier Pattern</h3>
        <p className="text-muted-foreground mb-4">
          First tier: API gateway sets coarse limits (e.g., 10k req/sec per IP).
          Second tier: Per-endpoint middleware sets fine limits (e.g., 100 req/sec for auth endpoint).
          This defense-in-depth approach protects both infrastructure and business logic.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">User-Tier Pattern</h3>
        <p className="text-muted-foreground mb-4">
          Free users get 100 req/min, paid users get 10k req/min. Tier is looked up from user database per request.
          More complex but aligns rate limits with business model.
        </p>
      </DocsSection>

      <DocsSection id="monitoring" title="Monitoring and Alerting" ref={(el) => registerSection?.('monitoring', el)}>
        <h3 className="text-lg font-semibold mt-6 mb-2">Key Metrics to Track</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
          <li><strong>Total Requests:</strong> Baseline traffic volume</li>
          <li><strong>Rate Limit Hits:</strong> How many requests were rejected per minute</li>
          <li><strong>Unique Blocked Identities:</strong> How many users/IPs hit limits</li>
          <li><strong>Top Endpoints:</strong> Which endpoints trigger limits most often</li>
          <li><strong>Block Duration Engagements:</strong> Users in cooldown period</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">Alert Conditions</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>Rate limit hit rate exceeds 5% of traffic → may indicate attack or misconfiguration</li>
          <li>Same IP blocks 10+ endpoints → likely DDoS attack, escalate to security</li>
          <li>Redis latency exceeds 100ms → rate limiter bottleneck, investigate</li>
          <li>Authenticated users hitting limits → legitimate users affected, adjust limits</li>
        </ul>
      </DocsSection>

      <DocsSection id="troubleshooting" title="Troubleshooting" ref={(el) => registerSection?.('troubleshooting', el)}>
        <h3 className="text-lg font-semibold mt-6 mb-2">Users Blocked on Legitimate Traffic</h3>
        <p className="text-muted-foreground mb-2"><strong>Symptom:</strong> Legitimate users report "too many requests" errors.</p>
        <p className="text-muted-foreground mb-4"><strong>Solution:</strong> Check user tier, increase limits for authenticated users, or adjust duration window.
        Analyze logs to see if user is making legitimate rapid calls or if they have a bug causing duplicate requests.</p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Rate Limiter Not Blocking Traffic</h3>
        <p className="text-muted-foreground mb-2"><strong>Symptom:</strong> Rate limiter middleware is installed but requests still go through after limit.</p>
        <p className="text-muted-foreground mb-4"><strong>Solution:</strong> Verify Redis is connected and accessible. Check that middleware is applied to correct routes.
        Test manually with curl: <code className="bg-muted px-1 rounded">{'for i in {1..200}; do curl example.com; done'}</code></p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Redis Memory Growing Continuously</h3>
        <p className="text-muted-foreground mb-2"><strong>Symptom:</strong> Redis memory usage increases over time without bound.</p>
        <p className="text-muted-foreground mb-4"><strong>Solution:</strong> Configure Redis key expiration via rate-limiter-flexible. Set <code className="bg-muted px-1 rounded">keyExpirationMS</code> or
        ensure duration window is set. Monitor with <code className="bg-muted px-1 rounded">redis-cli</code> commands like <code className="bg-muted px-1 rounded">MEMORY STATS</code>.</p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Inconsistent Limits Across Servers</h3>
        <p className="text-muted-foreground mb-2"><strong>Symptom:</strong> Load balanced across multiple servers, limits differ per server.</p>
        <p className="text-muted-foreground mb-4"><strong>Solution:</strong> Ensure all servers connect to the same Redis instance. Use cluster mode for HA.
        Verify key derivation is identical (same logic for user ID vs IP fallback).</p>

        <h3 className="text-lg font-semibold mt-6 mb-2">High Latency on Rate Limit Checks</h3>
        <p className="text-muted-foreground mb-2"><strong>Symptom:</strong> API response time increased after adding rate limiter.</p>
        <p className="text-muted-foreground mb-4"><strong>Solution:</strong> Move rate limiter check earlier in middleware chain to fail fast.
        Use Redis pipeline or batch limit checks. Monitor Redis latency separately.</p>
      </DocsSection>
    </div>
  );
}
