import React, { useState, useRef, useEffect } from "react";

function Header({ toggle }) {  // ✅ FIX: receive toggle here
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username = "Admin User";
  const email = "admin@corada.news";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header">

      {/* LEFT */}
      <div className="header-left">
        <span className="menu" onClick={toggle}>☰</span> {/* ✅ NOW WORKS */}
        <h2 className="logo">
          corada<span className="dot">.news</span>
        </h2>
      </div>

      {/* RIGHT */}
      <div className="header-right">

        <input className="search" placeholder="Search..." />

        <div className="admin-container" ref={dropdownRef}>
          <button
            className="admin-btn"
            onClick={() => setOpen(!open)}
          >
            <span className="avatar small">
              {username
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>

            <span>{username}</span>
            <span className="arrow">▾</span>
          </button>

          {open && (
            <div className="admin-dropdown">

              <div className="admin-info">
                <div className="avatar big">
                  {username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <p className="admin-name">{username}</p>
                  <p className="admin-email">{email}</p>
                </div>
              </div>

              <div className="divider"></div>

              <button className="logout-btn" onClick={handleLogout}>
                ↩ Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Header;