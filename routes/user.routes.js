import { Router } from "express";

export function createUserRoutes(limiters) {
  const router = Router();
  const { readLimiter, writeLimiter } = limiters;

  router.get("/me", readLimiter, (req, res) => {
    const userId = req.user?.id;
    res.json({
      success: true,
      data: { id: userId, role: req.user?.role ?? "user" },
    });
  });

  router.put("/me", writeLimiter, (req, res) => {
    res.json({ success: true, message: "Profile updated (PUT)" });
  });

  router.patch("/me", writeLimiter, (req, res) => {
    res.json({ success: true, message: "Profile updated (PATCH)" });
  });

  router.delete("/me", writeLimiter, (req, res) => {
    res.json({ success: true, message: "Account deletion requested" });
  });

  return router;
}
