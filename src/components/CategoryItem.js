import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
function CategoryItem({ cat, refresh, language }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(cat.categoryname || "");
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
          englishName:
            language === "english" ? newName : cat.englishName,

          teluguName:
            language === "telugu" ? newName : cat.teluguName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  toast.success("Updated successfully ");
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
      toast.error("Delete failed ❌");
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
          <span>
            {language === "telugu"
              ? cat.teluguName
              : cat.englishName}
          </span>

          <div className="actions">
            <button
              onClick={() => {
                setNewName(
                  language === "telugu"
                    ? cat.teluguName
                    : cat.englishName
                );
                setEditing(true);
              }}
            >
              ✏️
            </button>
            <button onClick={handleDelete}>🗑️</button>
          </div>
        </>
      )}
    </li>
  );
}

export default CategoryItem;