import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteNews, editNews } from "../api/newsApi";
import NewsItem from "../components/NewsItem";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "../components/FontSize";
function Dashboard() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [editingNews, setEditingNews] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,
      Link.configure({ openOnClick: true }),
    ],
    content: editingNews?.content || "",
    onUpdate: ({ editor }) => {
      setEditingNews((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  // FETCH
  const fetchNews = async (pageNum = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://api.korada.news/api/v1/news?page=${pageNum}&limit=10`
      );

      const newData = res.data.allNews || res.data.news || [];

      // ✅ SET TOTAL
      setTotal(res.data.total);

      if (pageNum === 1) {
        setNews(newData);
      } else {
        setNews((prev) => [...prev, ...newData]);
      }

      // ✅ FIXED LOGIC
      const totalLoaded =
        pageNum === 1 ? newData.length : news.length + newData.length;

      if (totalLoaded >= res.data.total) {
        setHasMore(false);
      }

    } catch (err) {
      toast.error("Failed to fetch news ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

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

      setCategories(res.data.categories);
    } catch (err) {
      console.log("Category fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // LOAD MORE
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  // DELETE
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNews(selectedId);

      toast.success("News deleted successfully 🗑️");

      fetchNews(1);
    } catch (err) {
      toast.error("Delete failed ❌");
    } finally {
      setShowModal(false);
      setSelectedId(null);
    }
  };

  // OPEN EDIT
  const handleEdit = (item) => {
    // 🔥 match using categoryId directly (BEST WAY)
    const selectedCategory = categories.find(
      (c) =>
        c.categoryId === item.categoryId ||   // ✅ MAIN FIX
        c._id === item.categoryId
    );

    setEditingNews({
      ...item,

      // ✅ ALWAYS set correct id
      categoryId: selectedCategory?._id || item.categoryId || "",
      categorySlug: selectedCategory?.slug || "",

      styles: item.styles || {
        titleFontSize: "24px",
        contentFontSize: "16px",
        fontFamily: "Arial",
        titleColor: "#000000",
        contentColor: "#333333",
        isBold: false,
        isItalic: false
      }
    });

    setShowDrawer(true);

    setTimeout(() => {
      editor?.commands.setContent(item.content || "");
    }, 100);
  };

  // UPDATE
  const handleUpdateNews = async () => {
    try {
      await editNews(editingNews.newsId, {
        ...editingNews
      });

      toast.success("News updated successfully ✏️");

      fetchNews(1);
      setShowDrawer(false);

    } catch (err) {
      toast.error("Update failed ❌");
    }
  };

  return (
    <>
      <h1>Latest News</h1>


      <p style={{ textAlign: "right", marginBottom: "20px", color: "#555" }}>
        Showing {news.length} of {total} news
      </p>


      <div className="news-grid">
        {news.length === 0 ? (
          <p>No news available</p>
        ) : (
          news.map((item) => (
            <NewsItem
              key={item._id}
              item={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="primary-btn"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this news?"
      />

      {/* ✅ EDIT DRAWER FIXED */}
      {showDrawer && editingNews && (
        <div className="drawer-overlay">
          <div className="drawer">

            <div className="drawer-header">
              <h3>Edit News</h3>
              <button onClick={() => setShowDrawer(false)}>✖</button>
            </div>

            {/* ✅ TITLE FIX */}
            {/* 🔥 TITLE */}
            <h3>Title:</h3>
            <input
              value={editingNews.title || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  title: e.target.value
                })
              }
            />

            {/* 🔥 LANGUAGE */}
            <h3>Language:</h3>
            <select
              value={editingNews.language || "english"}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  language: e.target.value
                })
              }
            >
              <option value="english">English</option>
              <option value="telugu">Telugu</option>
            </select>

            {/* 🔥 CATEGORY */}
            <h3>Category:</h3>
            <select
              value={editingNews.categoryId || ""}
              onChange={(e) => {
                const selected = categories.find(c => c._id === e.target.value);

                setEditingNews({
                  ...editingNews,
                  categoryId: selected.categoryId,
                  categoryName: selected.englishName, // or teluguName if needed
                  categorySlug: selected.slug // 🔥 important for expertvoices condition
                });
              }}
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.englishName}
                </option>
              ))}
            </select>

            {/* 🔥 IMAGE */}
            <h3>Image URL:</h3>
            <input
              value={editingNews.mediaUrl || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  mediaUrl: e.target.value
                })
              }
            />

            {/* 🔥 PREVIEW */}
            {editingNews.mediaUrl && (
              <img
                src={editingNews.mediaUrl}
                alt="preview"
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
            )}

            {/* 🔥 CONTENT */}
            <h3>Content:</h3>

            <div className="editor-box">

              {/* TOOLBAR */}
              <div className="editor-toolbar">

                <button onClick={() => editor?.chain().focus().toggleBold().run()}>
                  B
                </button>

                <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
                  I
                </button>

                <button onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                  U
                </button>

                <select
                  onChange={(e) =>
                    editor?.chain().focus().setFontSize(e.target.value).run()
                  }
                >
                  <option value="">Size</option>
                  <option value="14px">14</option>
                  <option value="16px">16</option>
                  <option value="18px">18</option>
                  <option value="20px">20</option>
                  <option value="24px">24</option>
                </select>

                <input
                  type="color"
                  onChange={(e) =>
                    editor?.chain().focus().setColor(e.target.value).run()
                  }
                />

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
                >
                  🔗
                </button>

                <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                  H1
                </button>

                <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                  H2
                </button>

                <button onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                  • List
                </button>

              </div>

              {/* EDITOR */}
              <EditorContent editor={editor} />

            </div>

            {/* 🔥 EXPERT FIELDS */}
            {/* 🔥 EXPERT FIELDS (ONLY FOR EXPERT VOICES) */}
            {editingNews.categorySlug === "expertvoices" && (
              <>
                <h3>Expert Name:</h3>
                <input
                  value={editingNews.expertName || ""}
                  onChange={(e) =>
                    setEditingNews({
                      ...editingNews,
                      expertName: e.target.value
                    })
                  }
                />

                <h3>Expert Role:</h3>
                <input
                  value={editingNews.expertRole || ""}
                  onChange={(e) =>
                    setEditingNews({
                      ...editingNews,
                      expertRole: e.target.value
                    })
                  }
                />

                <h3>Expert Image:</h3>
                <input
                  value={editingNews.expertImage || ""}
                  onChange={(e) =>
                    setEditingNews({
                      ...editingNews,
                      expertImage: e.target.value
                    })
                  }
                />

                {/* ✅ PREVIEW */}
                {editingNews.expertImage && (
                  <img
                    src={editingNews.expertImage}
                    alt="expert preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "10%",   // 🔥 looks like profile pic
                      marginTop: "10px"
                    }}
                  />
                )}

                <h3>Short Bio:</h3>
                <textarea
                  value={editingNews.shortBio || ""}
                  onChange={(e) =>
                    setEditingNews({
                      ...editingNews,
                      shortBio: e.target.value
                    })
                  }
                />
              </>
            )}
            {/* 🔥 STYLES */}
            <h3>Title Font Size:</h3>
            <input
              value={editingNews.styles?.titleFontSize || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  styles: {
                    ...editingNews.styles,
                    titleFontSize: e.target.value
                  }
                })
              }
            />

            <h3>Content Font Size:</h3>
            <input
              value={editingNews.styles?.contentFontSize || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  styles: {
                    ...editingNews.styles,
                    contentFontSize: e.target.value
                  }
                })
              }
            />

            <h3>Font Family:</h3>
            <input
              value={editingNews.styles?.fontFamily || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  styles: {
                    ...editingNews.styles,
                    fontFamily: e.target.value
                  }
                })
              }
            />

            <h3>Title Color:</h3>
            <input
              type="color"
              value={editingNews.styles?.titleColor || "#000000"}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  styles: {
                    ...editingNews.styles,
                    titleColor: e.target.value
                  }
                })
              }
            />

            <h3>Content Color:</h3>
            <input
              type="color"
              value={editingNews.styles?.contentColor || "#333333"}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  styles: {
                    ...editingNews.styles,
                    contentColor: e.target.value
                  }
                })
              }
            />            <button
              className="primary-btn"
              onClick={handleUpdateNews}
            >
              Update News
            </button>

          </div>
        </div>
      )}


    </>
  );
}

export default Dashboard;