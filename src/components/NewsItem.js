import React, { useState } from "react";

function NewsItem({ item, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);

  const handleSave = () => {
    if (!title || !content) {
      alert("All fields required");
      return;
    }

    onEdit(item._id, { title, content });
    setIsEditing(false);
  };

  return (
    <div className="news-card">

      {/* IMAGE */}
      <div className="news-img">
        {item.mediaType === "image" ? (
          <img src={item.mediaUrl} alt="news" />
        ) : (
          <video src={item.mediaUrl} controls />
        )}
      </div>

      {/* CONTENT */}
      <div className="news-content">
        {isEditing ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="edit-input"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="edit-textarea"
            />
          </>
        ) : (
          <>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </>
        )}
      </div>

      {/* ACTIONS */}
      <div className="news-actions">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSave}>💾</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>❌</button>
          </>
        ) : (
          <>
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete(item._id)}
            >
              🗑️
            </button>
          </>
        )}
      </div>

    </div>
  );
}

export default NewsItem;