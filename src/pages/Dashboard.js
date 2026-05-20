import React, { useEffect, useState } from "react";
import { getAllNews, deleteNews, editNews } from "../api/newsApi";
import NewsItem from "../components/NewsItem";

function Dashboard() {
  const [news, setNews] = useState([]);

  // ✅ FETCH NEWS
  const fetchNews = async () => {
    try {
      const res = await getAllNews();
      setNews(res.data.allNews || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ✅ DELETE
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure to delete?");
    if (!confirm) return;

    try {
      await deleteNews(id);
      alert("Deleted successfully");

      fetchNews(); // refresh
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ EDIT
  const handleEdit = async (id, updatedData) => {
  try {
    await editNews(id, updatedData);
    alert("Updated successfully");

    fetchNews(); // refresh
  } catch (err) {
    alert("Update failed");
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
    </>
  );
}

export default Dashboard;