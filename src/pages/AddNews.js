import React, { useState, useEffect } from "react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function AddNews() {
  const [mediaType, setMediaType] = useState("image");
  const [mediaMode, setMediaMode] = useState("upload");
  const [preview, setPreview] = useState(null);
  const [url, setUrl] = useState("");

  // ✅ FORM STATES
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("english");

  // ✅ CATEGORY STATE
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(false);

  const [titleFontSize, setTitleFontSize] = useState("24px");
  const [contentFontSize, setContentFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [titleColor, setTitleColor] = useState("#000000");
  const [contentColor, setContentColor] = useState("#333333");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

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
      console.log("FULL RESPONSE:", res.data);
      console.log("FULL RESPONSE:", res.data);
      setCategories(res.data.categories);
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
    setUrl("");
  };

  // URL INPUT
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setPreview(value);
  };

  // ✅ SUBMIT NEWS
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!title.trim()) return alert("Title required");

    const htmlContent = editor.getHTML();
    if (!htmlContent || htmlContent === "<p></p>") {
      alert("Content required");
      return;
    }

    if (!selectedCategory) return alert("Select category");

    const mediaUrl =
      mediaMode === "upload"
        ? preview
        : url;

    if (!mediaUrl) {
      alert("Media required");
      return;
    }

    const selectedCat = categories.find(
      (c) => c._id === selectedCategory
    );

    if (!selectedCat) {
      alert("Invalid category selected");
      return;
    }

    const styles = {
      titleFontSize,
      contentFontSize,
      fontFamily,
      titleColor,
      contentColor,
      isBold,
      isItalic
    };

    const payload = {
      title,
      content: htmlContent,
      mediaType,
      mediaUrl,
      categoryId: selectedCat.categoryId,
      categoryName: selectedCat.categoryname,
      language,
      styles
    };

    console.log("🚀 FINAL PAYLOAD:", payload);

    try {
      await axios.post(
        "https://api.korada.news/api/v1/news",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("News created successfully");

    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);
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
          <label>Content</label>

          <div className="editor-box">
            <EditorContent editor={editor} />
          </div>

          {/* 🎨 STYLE OPTIONS */}
          {/* 🎨 STYLE OPTIONS */}

          <label>Title Font Size</label>
          <select value={titleFontSize} onChange={(e) => setTitleFontSize(e.target.value)}>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
            <option value="36px">36px</option>
          </select>

          <label>Content Font Size</label>
          <select value={contentFontSize} onChange={(e) => setContentFontSize(e.target.value)}>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
          </select>

          <label>Font Family</label>
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>

          <label>Title Color</label>
          <input
            type="color"
            value={titleColor}
            onChange={(e) => setTitleColor(e.target.value)}
          />

          <label>Content Color</label>
          <input
            type="color"
            value={contentColor}
            onChange={(e) => setContentColor(e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={isBold}
              onChange={(e) => setIsBold(e.target.checked)}
            />
            Bold
          </label>

          <label>
            <input
              type="checkbox"
              checked={isItalic}
              onChange={(e) => setIsItalic(e.target.checked)}
            />
            Italic
          </label>

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