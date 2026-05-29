import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Analytics.css";

function Analytics() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH TRENDING ANALYTICS
  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://api.korada.news/api/v1/analytics/trending"
      );

      setStats(res.data.trending || []);

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
    <h1>Trending Analytics</h1>
    <p className="sub-text">
      Top performing news articles based on engagement metrics.
    </p>

    {/* 🔥 TOP TRENDING */}
    {!loading && stats.length > 0 && (
      <div className="top-trending">
        <img src={stats[0].article?.mediaUrl} alt="" />
        <div>
          <h2>🔥 Top Trending</h2>
          <h3>{stats[0].article?.title}</h3>
          <p>{stats[0].totalViews} Views</p>
        </div>
      </div>
    )}

    {/* ✅ GRID */}
    <div className="stats-grid">

      {loading ? (
        <p>Loading...</p>
      ) : stats.length === 0 ? (
        <p>No trending data available</p>
      ) : (
        stats
          .sort((a, b) => b.totalViews - a.totalViews) // 🔥 SORT
          .map((item, index) => (
            <div className="stat-card premium-card" key={index}>

              {/* 🖼 IMAGE */}
              <img
                className="card-img"
                src={item.article?.mediaUrl}
                alt=""
              />

              {/* 🔥 BADGE */}
              {index < 3 && <span className="badge">🔥 Trending</span>}

              <div className="card-content">

                {/* TITLE */}
                <h4>{item.article?.title}</h4>

                {/* SLUG */}
                <span className="slug">{item.articleSlug}</span>

                {/* MAIN METRIC */}
                <h2 className="views">{item.totalViews}</h2>
                <p className="views-label">Views</p>

                {/* DETAILS */}
                <div className="stat-details">
                  <p>Session: {item.totalSessionTime}</p>
                  <p>Avg: {item.averageSessionTime}</p>
                  <p>Bounce: {item.bounceCount}</p>
                  <p>Rate: {item.bounceRate}%</p>
                </div>

              </div>

            </div>
          ))
      )}

    </div>

    {/* Empty Section */}
    <div className="card">
      <div className="empty">
        <div className="empty-icon">📄</div>
        <p>
          {loading
            ? "Loading analytics..."
            : "No news to analyze yet."}
        </p>
      </div>
    </div>
  </>
);
}

export default Analytics;