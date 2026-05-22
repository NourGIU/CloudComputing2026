import express from "express";
import { getNotificationStatus } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/status", getNotificationStatus);

export default router;
