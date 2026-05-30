import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryItem from "../components/CategoryItem";

function Categories() {
  const [englishName, setEnglishName] = useState("");
  const [teluguName, setTeluguName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [color, setColor] = useState("red");
  const [language, setLanguage] = useState("english"); // ✅ NEW
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
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // ✅ LOAD ON START
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ ADD CATEGORY
  const handleAddCategory = async () => {
    const token = localStorage.getItem("token");

    setError("");
    setSuccess("");

    if (!englishName.trim() || !teluguName.trim()) {
      setError("Please enter both English and Telugu names");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://api.korada.news/api/v1/categories/create",
        {
          englishName,
          teluguName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Category added successfully!");
      setEnglishName("");
      setTeluguName("");

      fetchCategories(); // 🔥 refresh

    } catch (err) {
      if (err.response?.status === 409) {
        setError("Category already exists");
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

        {/* LEFT */}
        <div className="card">
          <div className="card-header">
            <div className="bar"></div>
            <h3>New Category</h3>
          </div>

          {/* Messages */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <label>English Name</label>
          <input
            placeholder="e.g. Entertainment"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
          />

          <label>Telugu Name</label>
          <input
            placeholder="e.g. వినోదం"
            value={teluguName}
            onChange={(e) => setTeluguName(e.target.value)}
          />

          {/* ✅ NEW LANGUAGE DROPDOWN */}
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="telugu">Telugu</option>
          </select>

          <button
            className="primary-btn"
            onClick={handleAddCategory}
            disabled={loading}
          >
            {loading ? "Adding..." : "+ Add Category"}
          </button>
        </div>

        {/* RIGHT */}
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
                <CategoryItem
                  key={cat._id}
                  cat={cat}
                  refresh={fetchCategories}
                  language={language}
                />
              ))}
            </ul>
          )}
        </div>

      </div>
    </>
  );
}

export default Categories;