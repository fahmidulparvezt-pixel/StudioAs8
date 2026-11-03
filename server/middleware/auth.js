import jwt from "jsonwebtoken";

// Reads the HTTPOnly "ss_token" cookie and rejects the request with 401 if it is missing or invalid.
export function requireAuth(req, res, next) {
  const token = req.cookies?.ss_token;
  if (!token) return res.status(401).json({ message: "Unauthorized: please log in first." });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized: your session has expired. Please log in again." });
  }
}

// Forwards async errors to the Express error handler.
export const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
