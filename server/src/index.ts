import "reflect-metadata";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { profileRoutes } from "./routes/profileRoutes";
import { lessonRoutes } from "./routes/lessonRoutes";
import { aiRoutes } from "./routes/aiRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api", (_req, res) => {
  res.json({ message: "Hello from PERN + TypeScript backend!" });
});

// Profile routes
app.use("/api/profile", profileRoutes);

// Lesson routes
app.use("/api/lessons", lessonRoutes);

// AI routes
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
