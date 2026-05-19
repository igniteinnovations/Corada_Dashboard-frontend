import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import AddNews from "./pages/AddNews";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import Ads from "./pages/Ads";

import "./styles.css";

function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Router>
      <Sidebar isOpen={isOpen} />

      <div className={`main ${isOpen ? "open" : "closed"}`}>
        <Navbar toggle={() => setIsOpen(!isOpen)} />

        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-news" element={<AddNews />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ads" element={<Ads />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;