import React, { useState } from "react";

function AdItem({ ad, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(ad.title);
  const [redirectUrl, setRedirectUrl] = useState(ad.redirectUrl);
  const [isActive, setIsActive] = useState(ad.isActive);

  const handleUpdate = () => {
    onEdit(ad.advertisementId, {
      title,
      redirectUrl,
      isActive,
    });
    setIsEditing(false);
  };

  return (
    <div className="ad-row">

      {/* LEFT SIDE */}
      <div className="ad-left">
        <img src={ad.imageUrl} alt="ad" />

        <div className="ad-text">
          {isEditing ? (
            <>
              {/* TITLE EDIT */}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Edit title"
              />

              {/* 🔥 LINK EDIT */}
              <input
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="Edit redirect URL"
              />
            </>
          ) : (
            <>
              <h4>{ad.title}</h4>

              {/* LINK DISPLAY */}
              <a
                href={ad.redirectUrl}
                target="_blank"
                rel="noreferrer"
                className="ad-link"
              >
                {ad.redirectUrl}
              </a>
            </>
          )}

          <p className={isActive ? "active" : "inactive"}>
            ● {isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="ad-actions">
        {isEditing ? (
          <>
            <button onClick={handleUpdate}>💾</button>
            <button onClick={() => setIsEditing(false)}>❌</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>✏️</button>
            <button onClick={() => onDelete(ad.advertisementId)}>🗑️</button>
          </>
        )}
      </div>

    </div>
  );
}

export default AdItem;