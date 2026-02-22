import { Router } from "express";

export function createResourceRoutes(limiters) {
  const router = Router();
  const { readLimiter, writeLimiter, heavyLimiter } = limiters;

  router.post("/", writeLimiter, (req, res) => {
    res.status(201).json({ success: true, message: "Resource created", id: "new-id" });
  });

  router.get("/:id", readLimiter, (req, res) => {
    res.json({ success: true, data: { id: req.params.id } });
  });

  router.put("/:id", writeLimiter, (req, res) => {
    res.json({ success: true, message: "Resource updated (PUT)", id: req.params.id });
  });

  router.patch("/:id", writeLimiter, (req, res) => {
    res.json({ success: true, message: "Resource updated (PATCH)", id: req.params.id });
  });

  router.delete("/:id", writeLimiter, (req, res) => {
    res.json({ success: true, message: "Resource deleted", id: req.params.id });
  });

  router.post("/:id/process", heavyLimiter, (req, res) => {
    res.json({ success: true, message: "Heavy process started", id: req.params.id });
  });

  return router;
}
