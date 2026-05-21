import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Folder, BarChart3, Megaphone, Sparkles } from "lucide-react";
// ❌ removed: FiSparkles

function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`sidebar ${isOpen ? "show" : "hide"}`}>
      <h2 className="logo-text">
        Korada<span className="dot">.News</span>
      </h2>

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

        <li>
          <NavLink to="/ads">
            <Megaphone size={18} />
            <span>Ads</span>
          </NavLink>
        </li>

        {/* ✅ Weekend Experiences */}
        <li>
  <NavLink to="/weekend-experiences">
    <Sparkles size={18} />
    <span>Weekend Experiences</span>
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