import React from "react";

function Categories() {
  return (
    <>
      <h1>Categories</h1>
      <p className="sub-text">Organize your news with categories</p>

      <div className="categories-layout">

        {/* LEFT CARD */}
        <div className="card">
          <div className="card-header">
            <div className="bar"></div>
            <h3>New Category</h3>
          </div>

          <label>Name</label>
          <input placeholder="e.g. Entertainment" />

          <label>Color</label>
          <div className="color-picker">
            <span className="color red"></span>
            <span className="color yellow"></span>
            <span className="color green"></span>
            <span className="color blue"></span>
            <span className="color purple"></span>
          </div>

          <button className="primary-btn">+ Add Category</button>
        </div>

        {/* RIGHT CARD */}
        <div className="card">
          <div className="card-header space-between">
            <h3>All Categories</h3>
            <span className="count">0 total</span>
          </div>

          <div className="empty">
            No categories yet.
          </div>
        </div>

      </div>
    </>
  );
}

export default Categories;