import React from "react";

function AddNews() {
  return (
    <>
      <h1>Add News</h1>

      <div className="grid-layout">

        {/* LEFT SIDE */}
        <div className="card main-form">

          <div className="card-header">
            <div className="bar"></div>
            <h3>News Details</h3>
          </div>

          {/* Title */}
          <label>Title</label>
          <input placeholder="Enter news title..." />

          {/* Row (Category + Status) */}
          <div className="row">
            <div className="col">
              <label>Category</label>
              <select>
                <option>Technology</option>
                <option>Sports</option>
                <option>Business</option>
                <option>Entertainment</option>
              </select>
            </div>

            <div className="col">
              <label>Status</label>
              <select>
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <label>Description</label>
          <textarea placeholder="Enter news content..." />

          <button className="primary-btn">Add News</button>
        </div>

        {/* RIGHT SIDE */}
        <div className="side-panel">
          <div className="card">
            <h4>Tips</h4>
            <ul>
              <li>Use clear headlines</li>
              <li>Keep content short</li>
              <li>Add categories</li>
            </ul>
          </div>

          <div className="card">
            <h4>Status</h4>
            <p>🟡 Draft mode enabled</p>
          </div>
        </div>

      </div>
    </>
  );
}

export default AddNews;