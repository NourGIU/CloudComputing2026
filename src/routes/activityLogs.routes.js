import express from "express";

import {
  getActivityLogs,
} from "../controllers/activityLogs.controller.js";

const router =
  express.Router();

router.get(
  "/",
  getActivityLogs
);

export default router;