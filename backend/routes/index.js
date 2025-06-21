import express from "express";
import authRoutes from "./auth.route.js";
import messengerRoute from "./messenger.route.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/messenger", messengerRoute);

export default router;
