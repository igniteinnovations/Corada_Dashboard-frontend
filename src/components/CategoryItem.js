import React, { useState } from "react";
import axios from "axios";

function CategoryItem({ cat, refresh }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(cat.categoryname?.english || ""); // ✅ FIX
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✏️ EDIT CATEGORY
  const handleUpdate = async () => {
    if (!newName.trim()) return;

    setLoading(true);

    try {
      await axios.put(
        `https://api.korada.news/api/v1/categories/${cat._id}`,
        {
          categoryname: newName,
language: "english" // or "telugu"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditing(false);
      refresh(); // 🔥 refresh list

    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE CATEGORY
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://api.korada.news/api/v1/categories/${cat._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refresh(); // 🔥 refresh list

    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <li className="category-item">
      {editing ? (
        <>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <button onClick={handleUpdate} disabled={loading}>
            ✔
          </button>

          <button onClick={() => setEditing(false)}>✖</button>
        </>
      ) : (
        <>
          <span>{cat.categoryname}</span> {/* ✅ FIX */}

          <div className="actions">
            <button onClick={() => setEditing(true)}>✏️</button>
            <button onClick={handleDelete}>🗑️</button>
          </div>
        </>
      )}
    </li>
  );
}

export default CategoryItem;