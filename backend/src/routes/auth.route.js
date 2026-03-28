import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/logout", logout);

router.post("/login", login);
router.post("/update-profile", protectRoute, updateProfile);

export default router;
