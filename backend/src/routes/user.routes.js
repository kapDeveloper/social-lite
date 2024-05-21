import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);

router.route("/login").post(login);

export default router;
