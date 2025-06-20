import express from "express";
import { userRegister, userLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user-login", userLogin);
router.post("/user-register", userRegister);

export default router;
