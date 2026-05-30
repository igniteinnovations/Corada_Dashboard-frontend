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
        title: editingNews.title,        // ✅ STRING (FIXED)
        content: editingNews.content,    // ✅ STRING (FIXED)
        styles: editingNews.styles
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

            <h3> Content:</h3>
            {/* ✅ CONTENT FIX */}
            <textarea
              value={editingNews.content || ""}
              onChange={(e) =>
                setEditingNews({
                  ...editingNews,
                  content: e.target.value
                })
              }
            />



            <div style={{ marginTop: "10px" }}>
              <img
                src={editingNews.mediaUrl}
                alt="preview"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            </div>

            <button
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