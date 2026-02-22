import {
  createSocketRateLimiters,
  checkSocketRateLimit,
  SOCKET_EVENT_LIMITS,
} from "./middlewares/socketRateLimiter.js";
import { attachSocketUser } from "./middlewares/socketUser.js";

export function initializeSocketHandlers(io, redisClient) {
  const socketLimiters = createSocketRateLimiters(redisClient, SOCKET_EVENT_LIMITS);

  io.use(attachSocketUser);

  io.on("connection", (socket) => {
    socket.on("chat:message", (payload, callback) => {
      checkSocketRateLimit(
        socketLimiters,
        socket,
        "chat:message",
        () => {
          socket.emit("error", { message: "Rate limit exceeded", code: "RATE_LIMIT" });
          typeof callback === "function" && callback({ error: "Rate limit exceeded" });
        },
        () => {
          typeof callback === "function" && callback({ ok: true });
        }
      );
    });

    socket.on("chat:typing", (payload, callback) => {
      checkSocketRateLimit(
        socketLimiters,
        socket,
        "chat:typing",
        () => {
          socket.emit("error", { message: "Rate limit exceeded", code: "RATE_LIMIT" });
          typeof callback === "function" && callback({ error: "Rate limit exceeded" });
        },
        () => {
          typeof callback === "function" && callback({ ok: true });
        }
      );
    });

    socket.on("notifications:pull", (payload, callback) => {
      checkSocketRateLimit(
        socketLimiters,
        socket,
        "notifications:pull",
        () => {
          socket.emit("error", { message: "Rate limit exceeded", code: "RATE_LIMIT" });
          typeof callback === "function" && callback({ error: "Rate limit exceeded" });
        },
        () => {
          typeof callback === "function" && callback({ ok: true });
        }
      );
    });
  });
}
