import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import studios from "./routes/studios.js";
import bookings from "./routes/bookings.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map((s) => s.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => res.json({ name: "StudioSpace API", status: "ok" }));
app.use("/api/studios", studios);
app.use("/api/bookings", bookings);

app.use((_req, res) => res.status(404).json({ message: "Route not found." }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON in request body." });
  res.status(500).json({ message: "Something went wrong on the server." });
});

if (process.env.VERCEL !== "1") {
  app.listen(process.env.PORT || 5000, () => console.log("StudioSpace API running"));
}
export default app;
