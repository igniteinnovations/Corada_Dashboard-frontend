import React, { useState, useEffect } from "react";
import axios from "axios";

function AddNews() {
  const [mediaType, setMediaType] = useState("image");
  const [mediaMode, setMediaMode] = useState("upload");
  const [preview, setPreview] = useState(null);
  const [url, setUrl] = useState("");

  // ✅ FORM STATES
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ✅ CATEGORY STATE
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ FETCH CATEGORIES
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
      console.log("Category fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // FILE UPLOAD
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setPreview(URL.createObjectURL(selected));
    setUrl(""); // clear URL if file used
  };

  // URL INPUT
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setPreview(value);
  };

  // ✅ SUBMIT NEWS
  const handleSubmit = async () => {
  console.log("🚀 handleSubmit triggered");

  const token = localStorage.getItem("token");
  console.log("🔑 Token:", token);

  // 🔥 VALIDATION (ALL REQUIRED)
  if (!title.trim()) {
    console.log("❌ Validation failed: Title missing");
    return alert("Title is required");
  }

  if (!content.trim()) {
    console.log("❌ Validation failed: Content missing");
    return alert("Content is required");
  }

  if (!selectedCategory) {
    console.log("❌ Validation failed: Category not selected");
    return alert("Please select category");
  }

  if (mediaMode === "upload" && !preview) {
    console.log("❌ Validation failed: No uploaded media");
    return alert("Please upload media");
  }

  if (mediaMode === "url" && !url.trim()) {
    console.log("❌ Validation failed: URL missing");
    return alert("Please enter media URL");
  }

  setLoading(true);
  console.log("⏳ Loading started");

  try {
    console.log("📦 Categories list:", categories);
    console.log("📌 Selected Category ID:", selectedCategory);

    // 🔥 IMPORTANT: backend expects categoryName (not ID)
    const selectedCat = categories.find(
      (c) => c._id === selectedCategory
    );

    console.log("✅ Matched Category Object:", selectedCat);

    const mediaUrl = mediaMode === "upload" ? preview : url;
    console.log("🖼️ Media Mode:", mediaMode);
    console.log("🔗 Media URL:", mediaUrl);

    const payload = {
      title,
      content,
      mediaType,
      mediaUrl,
      categoryName: selectedCat?.categoryname,
    };

    console.log("📤 Payload being sent:", payload);

    const response = await axios.post(
      "https://api.korada.news/api/v1/news",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("🎉 API Response:", response.data);

    alert("✅ News created successfully!");

    // RESET
    setTitle("");
    setContent("");
    setSelectedCategory("");
    setPreview(null);
    setUrl("");

    console.log("🔄 Form reset complete");

  } catch (err) {
    console.log("🔥 ERROR occurred:", err);

    if (err.response) {
      console.log("📛 Server Response Error:", err.response.data);
      console.log("📛 Status Code:", err.response.status);
    } else if (err.request) {
      console.log("📡 No response received:", err.request);
    } else {
      console.log("⚠️ Error Message:", err.message);
    }

    alert("❌ Failed to create news");
  } finally {
    setLoading(false);
    console.log("✅ Loading ended");
  }
};

  return (
    <>
      <h1>Add News</h1>

      <div className="grid-layout">

        {/* LEFT */}
        <div className="card main-form">

          <div className="card-header">
            <div className="bar"></div>
            <h3>News Details</h3>
          </div>

          {/* Title */}
          <label>Title</label>
          <input
            placeholder="Enter news title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Category */}
          <div className="row">
            <div className="col">
              <label>Category</label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled>
                  -- Select Category --
                </option>

                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryname}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading categories...</option>
                )}
              </select>
            </div>
          </div>

          {/* Description */}
          <label>Description</label>
          <textarea
            placeholder="Enter news content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* MEDIA TYPE */}
          <label>Media Type</label>
          <select
            value={mediaType}
            onChange={(e) => {
              setMediaType(e.target.value);
              setPreview(null);
              setUrl("");
            }}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>

          {/* TOGGLE */}
          <label>Upload Method</label>
          <div className="toggle-mode">
            <button
              type="button"
              className={mediaMode === "upload" ? "active" : ""}
              onClick={() => {
                setMediaMode("upload");
                setPreview(null);
              }}
            >
              Upload File
            </button>

            <button
              type="button"
              className={mediaMode === "url" ? "active" : ""}
              onClick={() => {
                setMediaMode("url");
                setPreview(null);
              }}
            >
              Paste URL
            </button>
          </div>

          {/* CONDITIONAL */}
          {mediaMode === "upload" ? (
            <>
              <label>Upload {mediaType}</label>
              <label className="upload-box">
                Click to Upload {mediaType}
                <input type="file" onChange={handleFileChange} hidden />
              </label>
            </>
          ) : (
            <>
              <label>Paste {mediaType} URL</label>
              <input
                placeholder={`Enter ${mediaType} URL`}
                value={url}
                onChange={handleUrlChange}
              />
            </>
          )}

          {/* PREVIEW */}
          {preview && (
            <div className="preview-box">
              {mediaType === "image" ? (
                <img src={preview} alt="preview" />
              ) : (
                <video src={preview} controls />
              )}
            </div>
          )}

          <button
            className="primary-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Add News"}
          </button>
        </div>

        {/* RIGHT */}
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