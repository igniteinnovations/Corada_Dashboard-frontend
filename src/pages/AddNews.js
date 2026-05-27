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
  const [expertName, setExpertName] = useState("");
  const [expertRole, setExpertRole] = useState("");
  const [expertImage, setExpertImage] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [expertFile, setExpertFile] = useState(null);
  const [expertPreview, setExpertPreview] = useState(null);

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
  const [selectedFile, setSelectedFile] = useState(null);

  //Added Cloudnary
  const uploadToCloudinary = async (file) => {
    console.log("📤 Uploading file to Cloudinary:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "news_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dljmnpj1i/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();


    console.log("✅ Cloudinary response:", data);
    console.log("🌐 Image URL:", data.secure_url);

    return data.secure_url;
  };

  const handleExpertFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExpertFile(file);
    setExpertPreview(URL.createObjectURL(file));
  };
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

    setSelectedFile(selected);
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

    let mediaUrl = "";

    if (mediaMode === "upload") {
      if (!selectedFile) {
        alert("Please upload a file");
        return;
      }

      // 🔥 UPLOAD TO CLOUDINARY
      mediaUrl = await uploadToCloudinary(selectedFile);

    } else {
      mediaUrl = url;
    }

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

    let expertImageUrl = "";

    if (selectedCat.categoryname === "expertvoices") {
      if (expertFile) {
        console.log("📤 Uploading expert image...");
        expertImageUrl = await uploadToCloudinary(expertFile);
        console.log("✅ Expert image URL:", expertImageUrl);
      }
    }

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

    // ✅ ADD THIS BELOW
    if (selectedCat.categoryname === "expertvoices") {
      payload.expertName = expertName;
      payload.expertRole = expertRole;
      payload.expertImage = expertImageUrl;
      payload.shortBio = shortBio;
    }
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
      setTitle("");
      setPreview(null);
      setUrl("");
      setSelectedCategory("");
      setMediaType("image");
      setMediaMode("upload");

      editor.commands.setContent("");

      setTitleFontSize("24px");
      setContentFontSize("16px");
      setFontFamily("Arial");
      setTitleColor("#000000");
      setContentColor("#333333");
      setIsBold(false);
      setIsItalic(false);

      setExpertName("");
      setExpertRole("");
      setExpertImage("");
      setShortBio("");

      setSelectedFile(null);


    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);

      // 🔥 HANDLE 409 ERROR
      if (err.response?.status === 409) {
        alert("⚠️ News already exists");
      }
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

          {/* ✅ ADD HERE (OUTSIDE SELECT) */}
          {selectedCategory &&
            categories.find(c => c._id === selectedCategory)?.categoryname === "expertvoices" && (
              <>
                <label>Expert Name</label>
                <input value={expertName} onChange={(e) => setExpertName(e.target.value)} />

                <label>Expert Role</label>
                <input value={expertRole} onChange={(e) => setExpertRole(e.target.value)} />

                <label>Expert Image URL</label>
                <input
                  value={expertImage}
                  onChange={(e) => setExpertImage(e.target.value)}
                  placeholder="Paste image URL"
                />

                {expertImage && (
                  <div className="preview-box">
                    <img src={expertImage} alt="expert preview" />
                  </div>
                )}

                <label>Short Bio</label>
                <textarea value={shortBio} onChange={(e) => setShortBio(e.target.value)} />
              </>
            )}

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