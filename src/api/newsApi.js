import axios from "axios";

const BASE_URL = "https://api.korada.news/api/v1/news";

// ✅ GET NEWS
export const getAllNews = async () => {
  try {
    console.log("📡 Fetching news...");

    const res = await axios.get(`${BASE_URL}?page=1&limit=10`);

    console.log("✅ GET RESPONSE:", res.data);

    return res;
  } catch (err) {
    console.error("❌ GET ERROR:", err.response || err.message);
    throw err;
  }
};

// ✅ EDIT NEWS
export const editNews = async (newsId, data) => {
  const token = localStorage.getItem("token");

  try {
    console.log("✏️ EDIT REQUEST:");
    console.log("ID:", newsId);
    console.log("DATA:", data);

    const res = await axios.put(
      `${BASE_URL}/${newsId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ EDIT RESPONSE:", res.data);

    return res;
  } catch (err) {
    console.error("❌ EDIT ERROR:", err.response || err.message);
    throw err;
  }
};

// ✅ DELETE NEWS
export const deleteNews = async (newsId) => {
  const token = localStorage.getItem("token");

  try {
    console.log("🗑 DELETE REQUEST ID:", newsId);

    const res = await axios.delete(
      `${BASE_URL}/${newsId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ DELETE RESPONSE:", res.data);

    return res;
  } catch (err) {
    console.error("❌ DELETE ERROR:", err.response || err.message);
    throw err;
  }
};