import React from "react";

function NewsItem({ item, onDelete, onEdit }) {
  return (
    <div className="news-card">

      {/* IMAGE */}
      <div className="news-img">
        {item.mediaType === "image" ? (
          <img
            src={item.mediaUrl}
            alt="news"
            onError={(e) => {
              e.target.src = "https://picsum.photos/300/200";
            }}
          />
        ) : (
          <video src={item.mediaUrl} controls />
        )}
      </div>

      {/* CONTENT */}
      <div className="news-content">
        <h3>{item.title?.english}</h3>
        <p>{item.content?.english}</p>
      </div>

      {/* ACTIONS */}
      <div className="news-actions">
        <button
          className="edit-btn"
          onClick={() => onEdit(item)} // 🔥 send full item
        >
          ✏️
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(item.newsId)}
        >
          🗑️
        </button>
      </div>

    </div>
  );
}

export default NewsItem;