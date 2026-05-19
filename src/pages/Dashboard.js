import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="sub-text">Overview of your news platform</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/add-news")}
        >
          + Add News
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <span>Total News</span>
            <div className="icon red">📰</div>
          </div>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Published</span>
            <div className="icon green">📈</div>
          </div>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Drafts</span>
            <div className="icon yellow">📄</div>
          </div>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Categories</span>
            <div className="icon blue">📁</div>
          </div>
          <h2>4</h2>
        </div>

      </div>

      {/* Recent News */}
      <div className="card">
        <div className="card-header space-between">
          <h3>Recent News</h3>
          <span className="count">0 total</span>
        </div>

        <div className="empty">
          <div className="empty-icon">🗂️</div>
          <p>No news yet. Create your first article.</p>
          <button
            className="primary-btn"
            onClick={() => navigate("/add-news")}
          >
            + Add News
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;