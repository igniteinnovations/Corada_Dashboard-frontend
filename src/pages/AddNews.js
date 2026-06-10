import React, { useState, useEffect } from "react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import toast from "react-hot-toast";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import "../components/AddNews.css";
import FontSize from "../components/FontSize";

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
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,
      Link.configure({
        openOnClick: true,
      }),

    ],
    content: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  //Added Cloudnary
  // ✅ FILE UPLOAD
  const uploadToCloudinary = async (file) => {
    try {
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

      if (!data.secure_url) {
        console.log("❌ Cloudinary error (FILE):", data);
        alert("Image upload failed");
        return null;
      }

      // 🔴 ORIGINAL INFO
      const originalSizeKB = (file.size / 1024).toFixed(2);
      console.log(`📦 Original File Size: ${originalSizeKB} KB`);
      console.log(`📏 Original: ${data.width}px x ${data.height}px`);

      // ✅ COMPRESSED + RESIZED
      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1200/"
      );

      // 🟢 FETCH COMPRESSED SIZE
      const optimizedRes = await fetch(optimizedUrl);
      const blob = await optimizedRes.blob();
      const optimizedSizeKB = (blob.size / 1024).toFixed(2);

      // 🎯 RESULT
      console.log(`⚡ Compressed Size: ${optimizedSizeKB} KB`);
      console.log(
        `📉 Reduction: ${(originalSizeKB - optimizedSizeKB).toFixed(2)} KB`
      );
      console.log(
        `📊 Compression: ${(
          ((originalSizeKB - optimizedSizeKB) / originalSizeKB) *
          100
        ).toFixed(2)}%`
      );

      console.log(`✅ Resized: ${data.width}px → max 1200px`);

      return optimizedUrl;

    } catch (err) {
      console.log("❌ Upload error (FILE):", err);
      alert("Upload failed");
      return null;
    }
  };

  // ✅ URL UPLOAD
  const uploadFromUrl = async (imageUrl) => {
    try {
      console.log("📤 Uploading URL to Cloudinary:", imageUrl);

      // 🔴 GET ORIGINAL SIZE
      const originalRes = await fetch(imageUrl);
      const originalBlob = await originalRes.blob();
      const originalSizeKB = (originalBlob.size / 1024).toFixed(2);

      const formData = new FormData();
      formData.append("file", imageUrl);
      formData.append("upload_preset", "news_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dljmnpj1i/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        alert("Invalid image URL");
        console.log("❌ Cloudinary error (URL):", data);
        return null;
      }

      console.log(`📦 Original Size: ${originalSizeKB} KB`);
      console.log(`📏 Original: ${data.width}px x ${data.height}px`);

      // ✅ COMPRESSED
      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1200/"
      );

      // 🟢 GET COMPRESSED SIZE
      const optimizedRes = await fetch(optimizedUrl);
      const blob = await optimizedRes.blob();
      const optimizedSizeKB = (blob.size / 1024).toFixed(2);

      // 🎯 RESULT
      console.log(`⚡ Compressed Size: ${optimizedSizeKB} KB`);
      console.log(
        `📉 Reduction: ${(originalSizeKB - optimizedSizeKB).toFixed(2)} KB`
      );
      console.log(
        `📊 Compression: ${(
          ((originalSizeKB - optimizedSizeKB) / originalSizeKB) *
          100
        ).toFixed(2)}%`
      );

      console.log(`✅ Resized: ${data.width}px → max 1200px`);

      return optimizedUrl;

    } catch (err) {
      console.log("❌ Upload error (URL):", err);
      alert("Upload failed");
      return null;
    }
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

  useEffect(() => {
    if (language === "telugu") {
      setFontFamily('"Noto Sans Telugu", sans-serif');
    } else {
      setFontFamily("Arial");
    }
  }, [language]);

  // FILE UPLOAD
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

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
      console.log("👉 Calling uploadFromUrl with:", url); // ✅ ADD THIS

      mediaUrl = await uploadToCloudinary(selectedFile);

    } else {
      if (!url) {
        alert("Paste media URL");
        return;
      }

      // 🔥 Upload URL to Cloudinary
      // const uploadFromUrl = async (imageUrl) => {
      //   try {
      //     const formData = new FormData();
      //     formData.append("file", imageUrl);
      //     formData.append("upload_preset", "news_upload");

      //     const res = await fetch(
      //       "https://api.cloudinary.com/v1_1/dljmnpj1i/image/upload",
      //       {
      //         method: "POST",
      //         body: formData,
      //       }
      //     );

      //     const data = await res.json();

      //     // ❌ If failed
      //     if (!data.secure_url) {
      //       alert("Invalid image URL. Please use direct image link (Unsplash, Imgur)");
      //       console.log("Cloudinary error:", data);
      //       return null;
      //     }

      //     // ✅ Optimize image
      //     return data.secure_url.replace(
      //       "/upload/",
      //       "/upload/f_auto,q_auto/"
      //     );

      //   } catch (err) {
      //     console.log("Upload error:", err);
      //     alert("Image upload failed");
      //     return null;
      //   }
      // };

      mediaUrl = await uploadFromUrl(url);

      // 🔥 STOP if upload failed
      if (!mediaUrl) return;
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
      categoryName:
        language === "telugu"
          ? selectedCat.teluguName
          : selectedCat.englishName,
      language,
      styles,

      // ✅ ADD THIS BLOCK
      ...(selectedCat.slug === "expertvoices" && {
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

      toast.success("News created successfully");

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
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="telugu">Telugu</option>
          </select>

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
                      {language === "telugu"
                        ? cat.teluguName
                        : cat.englishName}
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
            categories.find(c => c._id === selectedCategory)?.slug === "expertvoices" && (
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

              <select
                disabled={!editor || !editor.state.selection.content().size}
                onChange={(e) =>
                  editor?.chain().focus().setFontSize(e.target.value).run()
                }
              >
                <option value="">Size</option>
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
                <option value="28px">28</option>
              </select>


              <label
                className={`color-picker ${!editor || !editor.state.selection.content().size ? "disabled" : ""
                  }`}
              >
                🎨
                <input
                  type="color"
                  disabled={!editor || !editor.state.selection.content().size}
                  onChange={(e) =>
                    editor?.chain().focus().setColor(e.target.value).run()
                  }
                />
              </label>

              <button
                disabled={!editor || !editor.state.selection.content().size}
                onClick={() =>
                  editor?.chain().focus().setColor("#000000").run()
                }
              >
                Reset Color
              </button>

              <button
                onClick={() => {
                  const url = prompt("Enter URL");

                  if (url) {
                    editor
                      ?.chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: url })
                      .run();
                  }
                }}
                disabled={!editor || !editor.state.selection.content().size}
              >
                🔗 Link
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
            <div className={language === "telugu" ? "telugu-font" : ""}>
              <EditorContent editor={editor} />
            </div>

          </div>

          {/* 🎨 STYLE OPTIONS */}

          {/* <label>Title Font Size</label>
          <select value={titleFontSize} onChange={(e) => setTitleFontSize(e.target.value)}>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
            <option value="36px">36px</option>
          </select> */}

          {/* <label>Content Font Size</label>
          <select value={contentFontSize} onChange={(e) => setContentFontSize(e.target.value)}>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
          </select> */}

          {/* <label>Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          // disabled={language === "telugu"}
          >
            <option value="Arial">Arial</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
            <option value="Times New Roman">Times New Roman</option>
            {language === "telugu" ? (
              <>
                <option value='"Noto Sans Telugu", sans-serif'>
                  Noto Sans Telugu
                </option>
                <option value='"Noto Serif Telugu", serif'>
                  Noto Serif Telugu
                </option>
              </>
            ) : (
              <>
                <option value="Arial">Arial</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Times New Roman">Times New Roman</option>
              </>
            )}
          </select>

          <label>Title Color</label>
          <input
            type="color"
            value={titleColor}
            onChange={(e) => setTitleColor(e.target.value)}
          /> */}

          {/* <label>Content Color</label>
          <input
            type="color"
            value={contentColor}
            onChange={(e) => setContentColor(e.target.value)}
          /> */}

          {/* <label>
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
          </label> */}

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