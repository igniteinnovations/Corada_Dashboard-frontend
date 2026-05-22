import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteNews, editNews } from "../api/newsApi";
import NewsItem from "../components/NewsItem";

function Dashboard() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1); // ✅ NEW
  const [hasMore, setHasMore] = useState(true); // ✅ NEW
  const [loading, setLoading] = useState(false);

  // ✅ FETCH NEWS (UPDATED)
  const fetchNews = async (pageNum = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://api.korada.news/api/v1/news?page=${pageNum}&limit=10`
      );

      const newData = res.data.allNews || [];

      if (pageNum === 1) {
        setNews(newData); // first load
      } else {
        setNews((prev) => [...prev, ...newData]); // append
      }

      // ✅ check if more data exists
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

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await deleteNews(id);
      fetchNews(1); // refresh
    } catch (err) {
      console.log("Delete failed");
    }
  };

  // ✅ EDIT
  const handleEdit = async (id, updatedData) => {
    try {
      await editNews(id, updatedData);
      fetchNews(1); // refresh
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
              onDelete={handleDelete}
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
    </>
  );
}

export default Dashboard;