import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARES
====================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://utnfinal-frontend.onrender.com"
    ],
    credentials: true,
  })
);




app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

/* ======================
   DB + SERVER
====================== */
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("🔥 MongoDB conectado");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Mongo error:", err);
  });
