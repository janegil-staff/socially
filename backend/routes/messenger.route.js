import express from "express";
import { getFriends } from "../controllers/messenger.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-friends", authMiddleware, getFriends);

export default router;
