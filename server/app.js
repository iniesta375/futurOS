import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to FuturOS API "
  });
});

export default app;