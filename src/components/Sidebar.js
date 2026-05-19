import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Folder } from "lucide-react";
import { BarChart3 } from "lucide-react";

function Sidebar({ isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? "show" : "hide"}`}>
      <h2 className="logo">Corada</h2>

      <ul>
        <li>
          <NavLink to="/" end>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/add-news">
            <PlusCircle size={18} />
            <span>Add News</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/categories">
            <Folder size={18} />
            <span>Categories</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/analytics">
            <BarChart3 size={18} />
            <span>Analytics</span>
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        © 2026 Corada
      </div>
    </div>
  );
}

export default Sidebar;