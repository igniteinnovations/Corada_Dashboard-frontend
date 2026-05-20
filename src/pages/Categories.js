import React, { useState, useEffect } from "react";
import axios from "axios";

function Categories() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [color, setColor] = useState("red");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ FETCH ALL CATEGORIES
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://api.korada.news/api/v1/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(res.data.categories || []);
      console.log(res.data.categories);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // ✅ RUN ON LOAD
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ ADD CATEGORY
  const handleAddCategory = async () => {
    const token = localStorage.getItem("token");

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter category name");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://api.korada.news/api/v1/categories/create",
        {
          categoryname: name,
          color: color, // optional if backend supports
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Category added successfully!");
      setName("");

      // 🔥 Refresh instantly
      fetchCategories();

    } catch (err) {
      if (err.response?.status === 409) {
        setError("Category already exists");
      } else if (err.response?.status === 401) {
        setError("Unauthorized - Please login again");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

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

          {/* ERROR / SUCCESS */}
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

          <label>Name</label>
          <input
            placeholder="e.g. Entertainment"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Color</label>
          <div className="color-picker">
            {["red", "yellow", "green", "blue", "purple"].map((c) => (
              <span
                key={c}
                className={`color ${c} ${color === c ? "active" : ""}`}
                onClick={() => setColor(c)}
              ></span>
            ))}
          </div>

          <button
            className="primary-btn"
            onClick={handleAddCategory}
            disabled={loading}
          >
            {loading ? "Adding..." : "+ Add Category"}
          </button>
        </div>

        {/* RIGHT CARD */}
        <div className="card">
          <div className="card-header space-between">
            <h3>All Categories</h3>
            <span className="count">{categories.length} total</span>
          </div>

          {categories.length === 0 ? (
            <div className="empty">No categories yet.</div>
          ) : (
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat._id} className="category-item">
                  {/* 🎨 optional color dot */}
                  <span
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: cat.color || "#ccc",
                      marginRight: "8px",
                    }}
                  ></span>

                  {cat.categoryname}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </>
  );
}

export default Categories;