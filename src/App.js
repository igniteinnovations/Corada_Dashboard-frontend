import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { Toaster } from "react-hot-toast"; // ✅ ADD THIS

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import AddNews from "./pages/AddNews";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import Ads from "./pages/Ads";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WeekendExperiences from "./pages/WeekendExperiences";

import ProtectedRoute from "./components/ProtectedRoute";

import "./styles.css";

function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* ✅ TOASTER (GLOBAL) */}
      <Toaster position="top-right" /> {/* 🔥 ADD THIS */}

      {/* SIDEBAR */}
      {!hideLayout && <Sidebar isOpen={isOpen} />}

      {/* MAIN */}
      <div className={`main ${isOpen ? "open" : "closed"}`}>

        {/* NAVBAR */}
        {!hideLayout && (
          <Navbar toggle={toggleSidebar} />
        )}

        {/* CONTENT */}
        <div className="content">
          <Routes>

            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-news"
              element={
                <ProtectedRoute>
                  <AddNews />
                </ProtectedRoute>
              }
            />

            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ads"
              element={
                <ProtectedRoute>
                  <Ads />
                </ProtectedRoute>
              }
            />

            <Route
              path="/weekend-experiences"
              element={
                <ProtectedRoute>
                  <WeekendExperiences />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;