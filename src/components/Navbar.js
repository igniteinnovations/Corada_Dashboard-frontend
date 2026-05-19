import React from "react";
// import logo from "../assets/logo.png";

function Navbar({ toggle }) {
  return (
    <div className="navbar">
      <div className="nav-left">
        <span className="menu-icon" onClick={toggle}>☰</span>
        <h2>Korada<span className="dot">.News</span></h2>
      </div>

      <div className="nav-right">
        <input placeholder="Search..." />
        <button className="admin-btn">Admin</button>
      </div>
    </div>
  );
}

export default Navbar;