import axios from "axios";

const BASE_URL = "https://api.korada.news/api/v1/advertisements";

// ✅ CREATE AD
export const createAd = async (data) => {
  const token = localStorage.getItem("token");

  return axios.post(BASE_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✅ GET ADS (if backend supports)
export const getAds = async () => {
  const token = localStorage.getItem("token");

  return axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✅ EDIT AD
export const editAd = async (adId, data) => {
  const token = localStorage.getItem("token");

  return axios.put(
    `https://api.korada.news/api/v1/advertisements/${adId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ✅ DELETE AD
export const deleteAd = async (adId) => {
  const token = localStorage.getItem("token");

  return axios.delete(
    `https://api.korada.news/api/v1/advertisements/${adId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};