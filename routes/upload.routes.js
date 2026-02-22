import { Router } from "express";

export function createUploadRoutes(limiters) {
  const router = Router();
  const { uploadLimiter } = limiters;

  router.post("/upload", uploadLimiter, (req, res) => {
    res.json({ success: true, message: "Upload accepted" });
  });

  return router;
}
