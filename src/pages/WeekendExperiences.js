import React, { useState, useEffect } from "react";
import axios from "axios";

function WeekendExperiences() {
    const [showForm, setShowForm] = useState(false);
    const [experiences, setExperiences] = useState([]);

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
            await axios.post(
                "https://api.korada.news/api/v1/weekend-experiences",
                {
                    ...form,
                    rating: Number(form.rating),
                    tags: form.tags.split(",").map((t) => t.trim()),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("✅ Experience created!");

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

            setShowForm(false);
            fetchExperiences();

        } catch {
            alert("❌ Failed to create experience");
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
                    onClick={() => setShowForm(true)}
                >
                    + New Experience
                </button>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                <div className="stat-card"><span>TOTAL</span><h2>{experiences.length}</h2></div>
                <div className="stat-card"><span>FEATURED</span><h2>{experiences.filter(e => e.isFeatured).length}</h2></div>
                <div className="stat-card"><span>AVG RATING</span><h2>
                    {experiences.length
                        ? (experiences.reduce((a, b) => a + (b.rating || 0), 0) / experiences.length).toFixed(1)
                        : "—"}
                </h2></div>
                <div className="stat-card"><span>LOCATIONS</span><h2>
                    {[...new Set(experiences.map(e => e.location))].length}
                </h2></div>
            </div>

            {/* LIST */}
            <div className="card">
                <div className="card-header space-between">
                    <h3>All Experiences</h3>
                    <span className="count">{experiences.length} total</span>
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

                                    <p style={{ fontSize: "12px", color: "#666" }}>
                                        📍 {exp.location}
                                    </p>

                                    <p style={{ fontSize: "12px", color: "#666" }}>
                                        ⭐ {exp.rating}
                                    </p>

                                    {exp.isFeatured && (
                                        <span style={{ color: "green", fontSize: "12px" }}>
                                            ● Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ RIGHT SIDE DRAWER */}
            {showForm && (
                <div className="drawer-overlay" onClick={() => setShowForm(false)}>
                    <div
                        className="drawer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="drawer-header">
                            <h3>Create Weekend Experience</h3>
                            <button onClick={() => setShowForm(false)}>✖</button>
                        </div>

                        <div className="weekend-grid">

                            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
                            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
                            <input name="distance" placeholder="Distance" value={form.distance} onChange={handleChange} />
                            <input name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} />
                            <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
                            <input name="rating" type="number" placeholder="Rating" value={form.rating} onChange={handleChange} />

                            <select name="mediaType" value={form.mediaType} onChange={handleChange}>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>

                            <input name="mediaUrl" placeholder="Media URL" value={form.mediaUrl} onChange={handleChange} />
                            <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />

                            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

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
                            {loading ? "Creating..." : "Create Experience"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default WeekendExperiences;