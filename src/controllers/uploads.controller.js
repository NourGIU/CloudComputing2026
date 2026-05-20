import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3, buckets } from "../config/s3.js";

export const generateUploadUrl = async (req, res) => {
  try {
    const { fileName, contentType, taskId } = req.body;

    if (!fileName || !contentType || !taskId) {
      return res.status(400).json({
        error: "fileName, contentType and taskId are required",
      });
    }

    const timestamp = Date.now();

    const key = `tasks/${taskId}/original/${timestamp}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: buckets.ORIGINALS,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(
      s3,
      command,
      {
        expiresIn: 300,
      }
    );

    return res.status(200).json({
      uploadUrl,
      imageOriginalKey: key,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to generate upload URL",
    });
  }
};