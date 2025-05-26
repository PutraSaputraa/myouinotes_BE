import express from "express";
import cors from "cors";
import router from "./route/Route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AuthRoutes from "./route/AuthRoute.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5501', // nanti ganti ke URL frontend yang dihosting di GCP
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use("/auth", AuthRoutes);

// Cek root route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// GUNAKAN PORT dari environment (Cloud Run)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Up and Running on port ${PORT}...`));
``
