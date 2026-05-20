import express from "express";

import {
  generateUploadUrl,
} from "../controllers/uploads.controller.js";

const router = express.Router();

router.post("/upload-url", generateUploadUrl);

export default router;