import express from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/register", AuthController.signup); // alias for backwards compatibility
router.post("/login", AuthController.login);
router.get("/me", auth(), AuthController.getProfile);

export const AuthRoutes = router;
