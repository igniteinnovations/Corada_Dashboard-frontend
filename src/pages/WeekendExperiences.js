import React, { useState, useEffect } from "react";
import axios from "axios";

function WeekendExperiences() {
    const [showForm, setShowForm] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        distance: "",
        duration: "",
        price: "",
        rating: "",
        tags: "",
        mediaType: "image",
        mediaUrl: "",
        isFeatured: false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // ✅ FETCH
    const fetchExperiences = async () => {
        try {
            const res = await axios.get(
                "https://api.korada.news/api/v1/weekend-experiences"
            );
            setExperiences(res.data.experiences || []);
        } catch (err) {
            console.log("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    // ✅ DELETE
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("Delete this experience?")) return;

        try {
            await axios.delete(
                `https://api.korada.news/api/v1/weekend-experiences/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Deleted successfully");
            fetchExperiences();
        } catch {
            alert("Delete failed");
        }
    };

    // ✅ EDIT (prefill FULL FORM)
    const handleEdit = (exp) => {
        setForm({
            title: exp.title || "",
            description: exp.description || "",
            location: exp.location || "",
            distance: exp.distance || "",
            duration: exp.duration || "",
            price: exp.price || "",
            rating: exp.rating || "",
            tags: exp.tags ? exp.tags.join(", ") : "",
            mediaType: exp.mediaType || "image",
            mediaUrl: exp.mediaUrl || "",
            isFeatured: exp.isFeatured || false,
        });

        setEditingId(exp.experienceId); // 🔥 IMPORTANT
        setShowForm(true);
    };

    // ✅ CREATE + UPDATE (FULL PAYLOAD)
    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        if (
            !form.title ||
            !form.description ||
            !form.location ||
            !form.distance ||
            !form.duration ||
            !form.price ||
            !form.rating ||
            !form.mediaUrl
        ) {
            alert("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...form,
                rating: Number(form.rating),
                tags: form.tags.split(",").map((t) => t.trim()),
            };

            if (editingId) {
                // ✏️ UPDATE
                await axios.put(
                    `https://api.korada.news/api/v1/weekend-experiences/${editingId}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert("✅ Updated successfully");
            } else {
                // ➕ CREATE
                await axios.post(
                    "https://api.korada.news/api/v1/weekend-experiences",
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert("✅ Experience created!");
            }

            // RESET
            setForm({
                title: "",
                description: "",
                location: "",
                distance: "",
                duration: "",
                price: "",
                rating: "",
                tags: "",
                mediaType: "image",
                mediaUrl: "",
                isFeatured: false,
            });

            setEditingId(null);
            setShowForm(false);
            fetchExperiences();

        } catch {
            alert("❌ Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* HEADER */}
            <div className="dashboard-header">
                <div>
                    <h1>Weekend Experiences</h1>
                    <p className="sub-text">
                        Curate getaways, adventures and unique experiences
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={() => {
                        setEditingId(null);
                        setShowForm(true);
                    }}
                >
                    + New Experience
                </button>
            </div>

            {/* LIST */}
            <div className="card">
                <div className="card-header space-between">
                    <h3>All Experiences</h3>
                    <span>{experiences.length} total</span>
                </div>

                {experiences.length === 0 ? (
                    <div className="empty">✨ No experiences yet</div>
                ) : (
                    <div className="ads-scroll">
                        {experiences.map((exp) => (
                            <div key={exp._id} className="ad-card">

                                <img src={exp.mediaUrl} alt="exp" />

                                <div className="ad-info">
                                    <h4>{exp.title}</h4>
                                    <p>📍 {exp.location}</p>
                                    <p>⭐ {exp.rating}</p>

                                    {exp.isFeatured && (
                                        <span style={{ color: "green" }}>
                                            ● Featured
                                        </span>
                                    )}
                                </div>

                                {/* 🔥 ACTIONS */}
                                <div className="ad-actions">
                                    <button onClick={() => handleEdit(exp)}>✏️</button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(exp.experienceId)}
                                    >
                                        🗑
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DRAWER (FULL FORM PRESERVED) */}
            {showForm && (
                <div className="drawer-overlay" onClick={() => setShowForm(false)}>
                    <div className="drawer" onClick={(e) => e.stopPropagation()}>

                        <div className="drawer-header">
                            <h3>
                                {editingId ? "Edit Experience" : "Create Experience"}
                            </h3>
                            <button onClick={() => setShowForm(false)}>✖</button>
                        </div>

                        <div className="weekend-grid">

                            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
                            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
                            <input name="distance" value={form.distance} onChange={handleChange} placeholder="Distance" />
                            <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" />
                            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                            <input name="rating" type="number" value={form.rating} onChange={handleChange} placeholder="Rating" />

                            <select name="mediaType" value={form.mediaType} onChange={handleChange}>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>

                            <input name="mediaUrl" value={form.mediaUrl} onChange={handleChange} placeholder="Media URL" />
                            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" />

                            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

                        </div>

                        <div style={{ marginTop: "10px" }}>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                            />
                            <label style={{ marginLeft: "8px" }}>Mark as Featured</label>
                        </div>

                        <button
                            className="primary-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{ marginTop: "15px" }}
                        >
                            {editingId ? "Update Experience" : "Create Experience"}
                        </button>

                    </div>
                </div>
            )}

            {/* 🔥 CSS */}
            <style>{`
                .ad-actions {
                    display: flex;
                    gap: 8px;
                    margin-left: auto;
                }

                .delete-btn {
                    background: #ef4444;
                    color: white;
                }
            `}</style>
        </>
    );
}

export default WeekendExperiences;