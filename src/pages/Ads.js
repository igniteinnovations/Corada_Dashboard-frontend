import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdItem from "../components/AdItem";
import { createAd, getAds, editAd, deleteAd } from "../api/adsApi";
import "../components/DeleteModal.css";

function Ads() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  // ✅ NEW EDIT STATES (IMPORTANT)
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

    // 🔥 FILL EDIT STATE ONLY
    setEditTitle(ad.title || "");
    setEditImageUrl(ad.imageUrl || "");
    setEditRedirectUrl(ad.redirectUrl || "");

    setShowDrawer(true);
  };

  // ✅ UPDATE AD
  const handleUpdateAd = async () => {
    try {
      await editAd(editingAd.advertisementId, {
        title: editTitle,
        imageUrl: editImageUrl,
        redirectUrl: editRedirectUrl,
        isActive: true,
      });

      toast.success("Ad updated successfully ✨");

      setShowDrawer(false);
      setEditingAd(null);

      // 🔥 CLEAR EDIT STATE ONLY
      setEditTitle("");
      setEditImageUrl("");
      setEditRedirectUrl("");

      fetchAds();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // ✅ CREATE AD
  const handleAddAd = async () => {
    setError("");
    setSuccess("");

    if (!title || !imageUrl || !redirectUrl) {
        toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await createAd({
        title,
        imageUrl,
        redirectUrl,
        isActive: true,
      });

      toast.success("Ad created successfully 🎉");

      // 🔥 CLEAR ADD FORM ONLY
      setTitle("");
      setImageUrl("");
      setRedirectUrl("");

      fetchAds();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Ads Dashboard</h1>
      <p className="sub-text">Manage advertisements</p>

      <div className="categories-layout">

        {/* LEFT: ADD FORM */}
        <div className="card">
          <div className="card-header">
            <div className="bar"></div>
            <h3>Add New Ad</h3>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <label>Ad Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter ad title..."
          />

          <label>Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image link..."
          />

          <label>Redirect Link</label>
          <input
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="https://example.com"
          />

          <button
            className="primary-btn"
            onClick={handleAddAd}
            disabled={loading}
          >
            {loading ? "Adding..." : "+ Add Ad"}
          </button>
        </div>

        {/* RIGHT: ADS LIST */}
        <div className="card">
          <div className="card-header space-between">
            <h3>All Ads</h3>
            <span className="count">{ads.length} total</span>
          </div>

          {ads.length === 0 ? (
            <div className="empty">
              <p>No ads available</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* ✅ EDIT DRAWER */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={() => setShowDrawer(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>

            <div className="drawer-header">
              <h3>Edit Ad</h3>
              <button onClick={() => setShowDrawer(false)}>✖</button>
            </div>

            <label>Ad Title</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <label>Image URL</label>
            <input
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
            />

            <label>Redirect Link</label>
            <input
              value={editRedirectUrl}
              onChange={(e) => setEditRedirectUrl(e.target.value)}
            />

            <button className="primary-btn" onClick={handleUpdateAd}>
              Update Ad
            </button>

          </div>
        </div>
      )}

      {/* ✅ DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Ad?</h3>
            <p>Are you sure you want to delete this ad?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button className="delete-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ads;