import React from "react";

function Navbar({ toggle }) {
  return (
    <div className="navbar">
      <div className="nav-left">
        <span className="menu-icon" onClick={toggle}>☰</span>
        <h2>Corada<span className="dot">.</span>news</h2>
      </div>

      <div className="nav-right">
        <input placeholder="Search..." />
        <button className="admin-btn">Admin</button>
      </div>
    </div>
  );
}

export default Navbar;