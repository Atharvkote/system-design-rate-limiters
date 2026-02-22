export function authMiddleware(req, res, next) {
  const userId = req.get?.("x-user-id") || req.headers?.["x-user-id"];
  if (userId) {
    req.user = {
      id: userId,
      role: userId === "admin" ? "admin" : "user",
    };
  }
  next();
}

export default authMiddleware;
