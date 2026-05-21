// import React, { useState } from "react";
// import axios from "axios";

// function EditNews({ data, onClose, refresh }) {
//   const [title, setTitle] = useState(data.title);
//   const [content, setContent] = useState(data.content);
//   const [mediaUrl, setMediaUrl] = useState(data.mediaUrl);
//   const [mediaType, setMediaType] = useState(data.mediaType);
//   const [loading, setLoading] = useState(false);

//   const handleUpdate = async () => {
//     const token = localStorage.getItem("token");

//     if (!title || !content || !mediaUrl) {
//       return alert("All fields are required");
//     }

//     setLoading(true);

//     try {
//       await axios.put(
//         `https://api.korada.news/api/v1/news/${data.newsId}`,
//         {
//           title,
//           content,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("✅ Updated successfully");
//       refresh();   // reload list
//       onClose();   // close modal

//     } catch (err) {
//       console.log(err);
//       alert("❌ Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="edit-overlay">

//       <div className="edit-modal">

//         <h2>Edit News</h2>

//         {/* TITLE */}
//         <label>Title</label>
//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         {/* DESCRIPTION */}
//         <label>Description</label>
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />

//         {/* MEDIA */}
//         <label>Media URL</label>
//         <input
//           value={mediaUrl}
//           onChange={(e) => setMediaUrl(e.target.value)}
//         />

//         <label>Media Type</label>
//         <select
//           value={mediaType}
//           onChange={(e) => setMediaType(e.target.value)}
//         >
//           <option value="image">Image</option>
//           <option value="video">Video</option>
//         </select>

//         {/* 🔥 PREVIEW */}
//         <div className="preview-box">
//           {mediaType === "image" ? (
//             <img src={mediaUrl} alt="preview" />
//           ) : (
//             <video src={mediaUrl} controls />
//           )}
//         </div>

//         {/* ACTIONS */}
//         <div className="edit-actions">
//           <button onClick={handleUpdate} disabled={loading}>
//             {loading ? "Saving..." : "Save"}
//           </button>

//           <button onClick={onClose}>Cancel</button>
//         </div>

//       </div>

//     </div>
//   );
// }

// export default EditNews;