import express from "express";
import { getFriends, messageUploadDB } from "../controllers/messenger.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-friends", authMiddleware, getFriends);
router.post('/send-message',authMiddleware, messageUploadDB);

export default router;
