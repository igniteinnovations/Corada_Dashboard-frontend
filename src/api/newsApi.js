import axios from "axios";

const BASE_URL = "https://api.korada.news/api/v1/news";

// ✅ GET NEWS
export const getAllNews = async () => {
  return axios.get(`${BASE_URL}?page=1&limit=10`);
};

// ✅ EDIT NEWS
export const editNews = async (newsId, data) => {
  const token = localStorage.getItem("token");

  return axios.put(
    `${BASE_URL}/${newsId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ✅ DELETE NEWS
export const deleteNews = async (newsId) => {
  const token = localStorage.getItem("token");

  return axios.delete(
    `${BASE_URL}/${newsId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};