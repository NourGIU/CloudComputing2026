import React from "react";
import CommentsSection from "./CommentsSection.jsx";
import ImageUpload from "./ImageUpload.jsx";
import api from "../api.js";

export default function TaskDetailsModal({
  task,
  onClose,
}) {
  if (!task) {
    return null;
  }

  const handleImageUpload = async ({
    imageOriginalKey,
  }) => {
    try {

      await api.patch(
        `/tasks/${task.taskId}`,
        {
          imageOriginalKey,
        }
      );

      task.imageOriginalKey =
        imageOriginalKey;

    } catch (error) {
      console.error(error);
    }
  };

  // Build resized image key automatically
  const resizedImageKey =
    task.imageOriginalKey
      ? task.imageOriginalKey.replace(
          "/original/",
          "/resized/"
        )
      : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "700px",
          padding: "24px",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "16px",
            top: "16px",
          }}
        >
          Close
        </button>

        <h2>{task.title}</h2>

        <p>{task.description}</p>

        <p>
          <strong>Status:</strong>{" "}
          {task.status}
        </p>

        <p>
          <strong>Priority:</strong>{" "}
          {task.priority}
        </p>

        <p>
          <strong>Assignee:</strong>{" "}
          {task.assigneeName} (
          {task.assigneeId})
        </p>

        <p>
          <strong>Project ID:</strong>{" "}
          {task.projectId}
        </p>

        <p>
          <strong>Team ID:</strong>{" "}
          {task.teamId}
        </p>

        <p>
          <strong>Deadline:</strong>{" "}
          {task.deadline || "Not set"}
        </p>

        <p>
          <strong>Created By:</strong>{" "}
          {task.createdBy}
        </p>

        <p>
          <strong>Updated At:</strong>{" "}
          {task.updatedAt}
        </p>

        {/* ORIGINAL IMAGE */}
        {task.imageOriginalKey && (
          <div style={{ marginTop: "20px" }}>
            <h3>Original Image</h3>

            <img
              src={`https://mini-jira-original-images1.s3.eu-north-1.amazonaws.com/${task.imageOriginalKey}`}
              alt="Original Upload"
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        {/* RESIZED IMAGE */}
        {resizedImageKey && (
          <div style={{ marginTop: "20px" }}>
            <h3>Resized Image</h3>

            <img
              src={`https://mini-jira-resized-images1.s3.eu-north-1.amazonaws.com/${resizedImageKey}`}
              alt="Resized Upload"
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        <ImageUpload
          taskId={task.taskId}
          onUploadComplete={
            handleImageUpload
          }
        />

        <CommentsSection
          taskId={task.taskId}
        />
      </div>
    </div>
  );
}