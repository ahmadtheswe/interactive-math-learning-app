import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
