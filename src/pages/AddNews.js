import React, { useState, useEffect } from "react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

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
    extensions: [StarterKit, Underline],
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

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setPreview(e.target.value); // optional: show preview instantly
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

      console.log("CATEGORIES:", res.data);

      setCategories(res.data.categories); // ✅ IMPORTANT

    } catch (err) {
      console.log("Category fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // FILE UPLOAD
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // URL INPUT


  // ✅ SUBMIT NEWS
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    // ✅ VALIDATIONS
    if (!title.trim()) {
      alert("Title required");
      return;
    }

    const htmlContent = editor.getHTML();
    if (!htmlContent || htmlContent === "<p></p>") {
      alert("Content required");
      return;
    }

    if (!selectedCategory) {
      alert("Select category");
      return;
    }

    // ✅ MEDIA URL
    let mediaUrl = "";

    if (mediaMode === "upload") {
      if (!selectedFile) {
        alert("Upload a file");
        return;
      }

      mediaUrl = await uploadToCloudinary(selectedFile);
    } else {
      if (!url) {
        alert("Paste media URL");
        return;
      }

      mediaUrl = url;
    }

    // ✅ FIND CATEGORY
    const selectedCat = categories.find(
      (c) => c._id === selectedCategory
    );

    if (!selectedCat) {
      alert("Invalid category");
      return;
    }

    // ✅ STYLES
    const styles = {
      titleFontSize,
      contentFontSize,
      fontFamily,
      titleColor,
      contentColor,
      isBold,
      isItalic
    };

    // ✅ FINAL PAYLOAD
    const payload = {
      title,
      content: htmlContent,
      mediaType,
      mediaUrl,
      categoryId: selectedCat.categoryId,
      categoryName: selectedCat.categoryname,
      language,
      styles,

      // ✅ ADD THIS BLOCK
      ...(selectedCat.categoryname === "expertvoices" && {
        expertName,
        expertRole,
        expertImage,
        shortBio
      })
    };

    console.log("🚀 FINAL PAYLOAD:", payload);

    try {
      setLoading(true);

      await axios.post(
        "https://api.korada.news/api/v1/news",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ News created successfully");

      // 🔄 RESET FORM
      setTitle("");
      editor.commands.setContent("");
      setUrl("");
      setPreview(null);
      setSelectedCategory("");

    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
      } else {
        alert("Failed to create news");
      }
    } finally {
      setLoading(false);
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

            {/* TOOLBAR */}
            <div className="editor-toolbar">

              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={!editor || !editor.state.selection.content().size}
              >
                B
              </button>

              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={!editor || !editor.state.selection.content().size}
              >
                I
              </button>

              <button
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                disabled={!editor || !editor.state.selection.content().size}
              >
                U
              </button>

              <button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                disabled={!editor || !editor.state.selection.content().size}
              >
                H1
              </button>

              <button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                disabled={!editor || !editor.state.selection.content().size}
              >
                H2
              </button>

              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                disabled={!editor || !editor.state.selection.content().size}
              >
                • List
              </button>

            </div>
            {/* EDITOR */}
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