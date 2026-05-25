import React, { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0,
  });

  const [loading, setLoading] = useState(true);

  // ✅ FETCH ANALYTICS
  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // 👉 Replace with dynamic articleId later
      const res = await axios.get(
        "https://api.korada.news/api/v1/analytics/article/NEWS0001"
      );

      const data = res.data.stats;

      setStats({
        totalViews: data.totalViews || 0,
        totalLikes: data.totalLikes || 0,
        totalShares: data.totalShares || 0,
        totalComments: data.totalComments || 0,
      });

    } catch (err) {
      console.log("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

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
          <h2>{loading ? "..." : stats.totalViews}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Likes</span>
            <div className="icon green">👍</div>
          </div>
          <h2>{loading ? "..." : stats.totalLikes}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Dislikes</span>
            <div className="icon red">👎</div>
          </div>
          <h2>0</h2> {/* ❌ Not in API */}
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Comments</span>
            <div className="icon blue">💬</div>
          </div>
          <h2>{loading ? "..." : stats.totalComments}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Shares</span>
            <div className="icon yellow">🔗</div>
          </div>
          <h2>{loading ? "..." : stats.totalShares}</h2>
        </div>

      </div>

      {/* Empty Section */}
      <div className="card">
        <div className="empty">
          <div className="empty-icon">📄</div>
          <p>
            {loading
              ? "Loading analytics..."
              : "No news to analyze yet. Publish an article to see analytics."}
          </p>
        </div>
      </div>
    </>
  );
}

export default Analytics;