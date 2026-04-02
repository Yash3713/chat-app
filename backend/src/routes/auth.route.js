import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/logout", logout);

router.post("/login", login);
router.post("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth)

export default router;
