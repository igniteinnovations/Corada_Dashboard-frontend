import React, { useState, useEffect } from "react";
import AdItem from "../components/AdItem";
import { createAd, getAds, editAd, deleteAd } from "../api/adsApi";

function Ads() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this ad?");
    if (!confirm) return;

    try {
      await deleteAd(id);
      alert("Deleted successfully");
      fetchAds();
    } catch {
      alert("Delete failed");
    }
  };

  // ✅ EDIT
  const handleEdit = async (id, data) => {
    try {
      await editAd(id, data);
      alert("Updated successfully");
      fetchAds();
    } catch {
      alert("Update failed");
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
      setError("All fields are required");
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

      setSuccess("Ad created successfully!");

      setTitle("");
      setImageUrl("");
      setRedirectUrl("");

      fetchAds(); // refresh list
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

        {/* LEFT: FORM */}
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
    </>
  );
}

export default Ads;