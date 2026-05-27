import React from "react";

function NewsItem({ item, onDelete, onEdit }) {

  // ✅ PLACE IT HERE (inside component, before return)
  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

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
        <div
          className="news-title"
          style={{
            fontSize: item.styles?.titleFontSize || "22px",
            fontFamily: item.styles?.fontFamily || "Arial",
            color: item.styles?.titleColor || "#000",
            fontWeight: item.styles?.isBold ? "bold" : "normal",
            fontStyle: item.styles?.isItalic ? "italic" : "normal"

          }}
        >
          {item.title || "No Title"}
        </div>

        {/* ✅ FIXED HTML RENDER */}
        <div
          className="news-text"
          style={{
            fontSize: item.styles?.contentFontSize || "14px",
            fontFamily: item.styles?.fontFamily || "Arial",
            color: item.styles?.contentColor || "#333"
          }}
          dangerouslySetInnerHTML={{
            __html: decodeHTML(item.content || "<p>No Content</p>")
          }}
        />
      </div>

      {/* ACTIONS */}
      <div className="news-actions">
        <button onClick={() => onEdit(item)}>✏️</button>
        <button onClick={() => onDelete(item.newsId)}>🗑️</button>
      </div>

    </div>
  );
}

export default NewsItem;