import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteNews, editNews } from "../api/newsApi";
import NewsItem from "../components/NewsItem";
import ConfirmModal from "../components/ConfirmModal"; // ✅ ADD THIS

function Dashboard() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1); // ✅ NEW
  const [hasMore, setHasMore] = useState(true); // ✅ NEW
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false); // ✅
  const [selectedId, setSelectedId] = useState(null); // ✅

  // ✅ FETCH NEWS (UPDATED)
  const fetchNews = async (pageNum = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://api.korada.news/api/v1/news?page=${pageNum}&limit=10`
      );

      const newData = res.data.allNews || res.data.news || [];

      if (pageNum === 1) {
        setNews(newData); // first load
      } else {
        setNews((prev) => [...prev, ...newData]); // append
      }

      if (newData.length < 10) {
        setHasMore(false);
      }

    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

  // ✅ LOAD MORE BUTTON
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  // ✅ OPEN MODAL (THIS FIXES YOUR ERROR)
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      await deleteNews(selectedId);
      fetchNews(1);
    } catch (err) {
      console.log("Delete failed");
    } finally {
      setShowModal(false);
      setSelectedId(null);
    }
  };

  // ✅ EDIT
  const handleEdit = async (id, updatedData) => {
    try {
      await editNews(id, updatedData);
      fetchNews(1);
    } catch (err) {
      console.log("Update failed");
    }
  };

  return (
    <>
      <h1>Latest News</h1>

      <div className="news-grid">
        {news.length === 0 ? (
          <p>No news available</p>
        ) : (
          news.map((item) => (
            <NewsItem
              key={item._id}
              item={item}
              onDelete={handleDelete} // ✅ NOW WORKS
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* 🔥 LOAD MORE BUTTON */}
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

      {/* ✅ CONFIRM MODAL (THIS REMOVES WARNINGS) */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this news?"
      />
    </>
  );
}

export default Dashboard;