import "./env.js";

import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
});

export const buckets = {
  ORIGINALS: process.env.S3_ORIGINALS_BUCKET,
  RESIZED: process.env.S3_RESIZED_BUCKET,
};

console.log("S3 ORIGINAL BUCKET:", buckets.ORIGINALS);
console.log("S3 RESIZED BUCKET:", buckets.RESIZED);