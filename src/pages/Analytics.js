import React from "react";

function Analytics() {
  return (
    <>
      <h1>Analytics</h1>
      <p className="sub-text">
        Engagement metrics per news article — views, reactions, comments & shares.
      </p>

      {/* Stats */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Views</span>
            <div className="icon red">👁️</div>
          </div>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Likes</span>
            <div className="icon green">👍</div>
          </div>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Dislikes</span>
            <div className="icon red">👎</div>
          </div>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Comments</span>
            <div className="icon blue">💬</div>
          </div>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Shares</span>
            <div className="icon yellow">🔗</div>
          </div>
          <h2>0</h2>
        </div>

      </div>

      {/* Empty Section */}
      <div className="card">
        <div className="empty">
          <div className="empty-icon">📄</div>
          <p>No news to analyze yet. Publish an article to see analytics.</p>
        </div>
      </div>
    </>
  );
}

export default Analytics;