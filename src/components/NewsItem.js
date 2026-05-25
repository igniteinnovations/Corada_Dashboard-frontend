import React, { useState } from "react";

function NewsItem({ item, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title?.english || "");
  const [content, setContent] = useState(item.content?.english || "");

  // // ✅ DEBUG LOG
  // console.log("🖼 MEDIA TYPE:", item.mediaType);
  // console.log("🖼 MEDIA URL:", item.mediaUrl);

  const handleSave = () => {
    if (!title || !content) {
      alert("All fields required");
      return;
    }

    onEdit(item.newsId, {
      title: { english: title },
      content: { english: content }
    });
    setIsEditing(false);
  };

  return (
    <div className="news-card">

      {/* IMAGE */}
      <div className="news-img">
        {item.mediaType === "image" ? (
          <img
            src={item.mediaUrl}
            alt="news"
            onLoad={() => console.log("✅ Image Loaded:", item.mediaUrl)}
            onError={(e) => {
              console.log("❌ Image Failed:", item.mediaUrl);
              e.target.src = "https://picsum.photos/300/200";
            }}
          />
        ) : (
          <video
            src={item.mediaUrl}
            controls
            onLoadedData={() => console.log("✅ Video Loaded:", item.mediaUrl)}
            onError={() => console.log("❌ Video Failed:", item.mediaUrl)}
          />
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
            <h3>{item.title?.english}</h3>
            <p>{item.content?.english}</p>
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
              onClick={() => onDelete(item.newsId)}
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