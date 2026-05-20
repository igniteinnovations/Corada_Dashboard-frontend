import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import AddNews from "./pages/AddNews";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import Ads from "./pages/Ads";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import "./styles.css";

function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // 🔥 Hide sidebar/navbar on auth pages
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideLayout && <Sidebar isOpen={isOpen} />}

      <div className={`main ${isOpen ? "open" : "closed"}`}>
        {!hideLayout && (
          <Navbar toggle={() => setIsOpen(!isOpen)} />
        )}

        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
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