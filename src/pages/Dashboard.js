import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteNews, editNews } from "../api/newsApi";
import NewsItem from "../components/NewsItem";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

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
    setEditingNews({
      ...item,
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
            <h3> Image:</h3>
            <input
              placeholder="Enter Image URL"
              value={editingNews.mediaUrl || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  mediaUrl: e.target.value
                })
              }
            />
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
            <input
              value={editingNews.categoryName || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  categoryName: e.target.value
                })
              }
            />

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
            <textarea
              value={editingNews.content || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  content: e.target.value
                })
              }
            />

            {/* 🔥 EXPERT FIELDS */}
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