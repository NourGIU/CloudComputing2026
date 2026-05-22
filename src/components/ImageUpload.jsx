import React, { useState } from "react";
import api from "../api.js";

export default function ImageUpload({
  taskId,
  onUploadComplete,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image.");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Step 1 → Generate presigned URL
      const response = await api.post(
        "/uploads/upload-url",
        {
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          taskId,
        }
      );

      const {
        uploadUrl,
        imageOriginalKey,
      } = response.data;

      // Step 2 → Upload directly to S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      // Step 3 → Notify parent
      if (onUploadComplete) {
        onUploadComplete({
          imageOriginalKey,
        });
      }

    } catch (err) {
      console.error(err);
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <h3>Task Image</h3>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {previewUrl && (
        <div style={{ marginTop: "12px" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "200px",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginTop: "12px" }}
      >
        {uploading
          ? "Uploading..."
          : "Upload Image"}
      </button>
    </div>
  );
}