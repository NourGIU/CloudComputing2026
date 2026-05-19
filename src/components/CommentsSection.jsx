import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function CommentsSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tasks/${taskId}/comments`);
      setComments(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      loadComments();
    }
  }, [taskId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text) {
      setError("Comment text cannot be empty.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await api.post(`/tasks/${taskId}/comments`, { text });
      setText("");
      await loadComments();
    } catch (err) {
      console.error(err);
      setError("Failed to post comment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>Comments</h3>
      {loading && <p>Loading comments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {comments.length === 0 && !loading ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentId} style={{ borderBottom: "1px solid #ddd", padding: "8px 0" }}>
              <p><strong>{comment.userName}</strong> <span style={{ color: "#666" }}>{new Date(comment.createdAt).toLocaleString()}</span></p>
              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Write a comment..." style={{ width: "100%" }} />
        <button type="submit" disabled={saving}>{saving ? "Posting..." : "Post Comment"}</button>
      </form>
    </div>
  );
}
