
import { Router } from "express";

export function createAuthRoutes(limiters) {
  const router = Router();
  const { authLimiter } = limiters;

  router.post("/login", authLimiter, (req, res) => {
    res.json({ success: true, message: "Login handled" });
  });

  router.post("/register", authLimiter, (req, res) => {
    res.json({ success: true, message: "Registration handled" });
  });

  return router;
}
