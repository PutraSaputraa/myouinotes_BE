import express from "express"
import { authenticateToken } from "../middleware/AuthMiddleware.js"
import { refreshToken } from "../controller/RefreshToken.js"
import { login, logout, register } from "../controller/UserController.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete", logout);
router.get("/token", refreshToken);

export default router;
