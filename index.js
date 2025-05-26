import express from "express";
import cors from "cors";
import router from "./route/Route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AuthRoutes from "./route/AuthRoute.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5501', // ganti ke url frontend yang digenerate sm gcp
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use("/auth", AuthRoutes);

// Tambahkan ini biar akses "/" gak error
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

app.listen(5000, () => console.log('Server Up and Running...'));
