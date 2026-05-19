import React from "react";

function Ads() {
  return (
    <>
      <h1>Ads Management</h1>
      <p className="sub-text">Manage advertisements on your platform</p>

      <div className="categories-layout">

        {/* LEFT: ADD AD */}
        <div className="card">
          <div className="card-header">
            <div className="bar"></div>
            <h3>Add New Ad</h3>
          </div>

          <label>Ad Title</label>
          <input placeholder="Enter ad title..." />

          <label>Image URL</label>
          <input placeholder="Enter image link..." />

          <label>Redirect Link</label>
          <input placeholder="https://example.com" />

          <label>Placement</label>
          <select>
            <option>Homepage Banner</option>
            <option>Sidebar</option>
            <option>Between News</option>
          </select>

          <button className="primary-btn">+ Add Ad</button>
        </div>

        {/* RIGHT: LIST */}
        <div className="card">
          <div className="card-header space-between">
            <h3>All Ads</h3>
            <span className="count">0 total</span>
          </div>

          <div className="empty">
            <div className="empty-icon">📢</div>
            <p>No ads added yet.</p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Ads;