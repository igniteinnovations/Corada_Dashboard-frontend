import React from "react";

function AdItem({ ad, onDelete, onEdit }) {
  return (
    <div className="ad-row">

      <div className="ad-left">
        <img src={ad.imageUrl} alt="ad" />

        <div className="ad-text">
          <h4>{ad.title}</h4>

          <a
            href={ad.redirectUrl}
            target="_blank"
            rel="noreferrer"
            className="ad-link"
          >
            {ad.redirectUrl}
          </a>

          <p className={ad.isActive ? "active" : "inactive"}>
            ● {ad.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <div className="ad-actions">
        <button onClick={() => onEdit(ad)}>✏️</button> {/* ✅ PASS FULL OBJECT */}
        <button onClick={() => onDelete(ad.advertisementId)}>🗑️</button>
      </div>

    </div>
  );
}

export default AdItem;