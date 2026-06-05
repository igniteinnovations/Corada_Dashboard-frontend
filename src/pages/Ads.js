import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdItem from "../components/AdItem";
import { createAd, getAds, editAd, deleteAd } from "../api/adsApi";
import "../components/DeleteModal.css";
import "../components/Ads.css";
import ConfirmModal from "../components/ConfirmModal";

function Ads() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editRedirectUrl, setEditRedirectUrl] = useState("");

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);

  const [position, setPosition] = useState("");
  const [editPosition, setEditPosition] = useState("");

  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editSelectedCategories, setEditSelectedCategories] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ FETCH ADS
  const fetchAds = async () => {
    try {
      const res = await getAds();
      setAds(res.data.advertisements || []);
    } catch (err) {
      console.log("Fetch ads error:", err);
    }
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    setSelectedAdId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAd(selectedAdId);
      toast.success("Ad deleted successfully ✅");
      setShowDeleteModal(false);
      setSelectedAdId(null);
      fetchAds();
    } catch {
      alert("Delete failed ❌");
    }
  };

  // ✅ EDIT CLICK
  const handleEdit = (ad) => {
    setEditingAd(ad);
    setEditTitle(ad.title || "");
    setEditImageUrl(ad.imageUrl || "");
    setEditRedirectUrl(ad.redirectUrl || "");
    setEditPosition(ad.position || "");
    setEditSelectedCategories(ad.categoryIds || []);
    setShowDrawer(true);
  };

  // ✅ UPDATE
  const handleUpdateAd = async () => {
    try {
      await editAd(editingAd.advertisementId, {
        title: editTitle,
        imageUrl: editImageUrl,
        redirectUrl: editRedirectUrl,
        position: editPosition,
        categoryIds: editSelectedCategories,
        isActive: true,
      });


      toast.success("Ad updated successfully ✨");

      setShowDrawer(false);
      setEditingAd(null);

      setEditTitle("");
      setEditImageUrl("");
      setEditRedirectUrl("");
      setEditPosition("");
      setEditSelectedCategories([]);

      fetchAds();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  // ✅ CREATE
  const handleAddAd = async () => {
    if (!title || !imageUrl || !redirectUrl) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await createAd({
        title,
        imageUrl,
        redirectUrl,
        position,
        categoryIds: selectedCategories,
        isActive: true,
      });
      console.log("Response Data 👉", res.data);
      toast.success("Ad created successfully 🎉");

      setTitle("");
      setImageUrl("");
      setRedirectUrl("");
      setPosition("");
      setSelectedCategories([]);

      fetchAds();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH CATEGORIES
  const fetchCategoriesList = async () => {
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

      setCategoriesList(res.data.categories || []);
    } catch (err) {
      console.log("Category fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchCategoriesList();
  }, []);

  return (
    <>
      <h1>Ads Dashboard</h1>
      <p className="sub-text">Manage advertisements</p>

      <div className="categories-layout">

        {/* ADD FORM */}
        <div className="card">
          <div className="card-header">
            <div className="bar"></div>
            <h3>Add New Ad</h3>
          </div>

          <label>Ad Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>Image URL</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

          <label>Redirect Link</label>
          <input value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} />

          <label>Position</label>
          <input value={position} onChange={(e) => setPosition(e.target.value)} />

          <label>Categories</label> <br />
          {/* 🔥 DROPDOWN */}
          <div className="dropdown">
            <div
              className="dropdown-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedCategories.length > 0
                ? `${selectedCategories.length} selected`
                : "Select Categories"}
            </div>

            {showDropdown && (
              <div className="dropdown-content">
                {categoriesList.map((cat) => (
                  <div
                    key={cat._id}
                    className="dropdown-item"
                    onClick={() => {
                      if (selectedCategories.includes(cat.categoryId)) {
                        setSelectedCategories(
                          selectedCategories.filter(
                            (id) => id !== cat.categoryId
                          )
                        );
                      } else {
                        setSelectedCategories([
                          ...selectedCategories,
                          cat.categoryId,
                        ]);
                      }
                    }}
                  >


                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.categoryId)}
                      readOnly
                    />
                    <span>
                      {cat.englishName} / {cat.teluguName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="primary-btn" onClick={handleAddAd}>
            + Add Ad
          </button>
        </div>

        {/* ADS LIST */}
        <div className="card">
          <div className="card-header space-between">
            <h3>All Ads</h3>
            <span>{ads.length} total</span>
          </div>

          <div className="ads-scroll">
            {ads.map((ad) => (
              <AdItem
                key={ad._id || ad.advertisementId}
                ad={ad}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      </div>

      {/* EDIT DRAWER */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={() => setShowDrawer(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-header">
                <h3>Edit Ad</h3>

                <button
                  className="close-btn"
                  onClick={() => setShowDrawer(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <input value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} />
            <input value={editRedirectUrl} onChange={(e) => setEditRedirectUrl(e.target.value)} />
            <input value={editPosition} onChange={(e) => setEditPosition(e.target.value)} />

            <div className="drawer-actions">

              <button className="update-btn" onClick={handleUpdateAd}>
                Update Ad
              </button>
            </div>
          </div>
        </div>

      )}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this ad?"
      />
    </>
  );
}

export default Ads;