import { Router } from "express";

export function createPublicRoutes(limiters) {
  const router = Router();
  const { publicLimiter } = limiters;

  router.get("/info", publicLimiter, (req, res) => {
    res.json({ success: true, info: { version: "1.0", name: "API" } });
  });

  router.get("/status", publicLimiter, (req, res) => {
    res.json({ success: true, status: "operational" });
  });

  return router;
}
