import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Eye,
  FileText,
  Users,
  Timer,
  TrendingUp,
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from "recharts";

import "./Analytics.css";

function Analytics() {
  const [stats, setStats] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "https://api.korada.news/api/v1/analytics/admin/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sorted = (res.data.analytics || []).sort(
        (a, b) => b.totalViews - a.totalViews
      );

      setStats(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔢 METRICS
  const totalViews = stats.reduce((a, b) => a + (b.totalViews || 0), 0);
  const totalSessions = stats.reduce((a, b) => a + (b.totalSessions || 0), 0);
  const avgSession =
    stats.reduce((a, b) => a + (b.averageSessionTime || 0), 0) /
    (stats.length || 1);

  const bounceRate =
    stats.reduce((a, b) => a + (b.bounceRate || 0), 0) /
    (stats.length || 1);

  // 📊 CHART DATA
  const chartData = stats.slice(0, 7).map((item, i) => ({
    name: `#${i + 1}`,
    views: item.totalViews,
  }));

  const pieData = [
    { name: "Bounce", value: bounceRate },
    { name: "Engaged", value: 100 - bounceRate },
  ];

  const COLORS = ["#ff4d4d", "#4caf50"];

  return (
    <div className="analytics-dashboard">

      <h1>Analytics Dashboard</h1>

      {/* 🔥 TOP CARDS */}
      <div className="top-cards">

        <div className="dashboard-card">
          <FileText size={22} />
          <h4>Total Articles</h4>
          <h2>{stats.length}</h2>
        </div>

        <div className="dashboard-card">
          <Eye size={22} />
          <h4>Total Views</h4>
          <h2>{totalViews}</h2>
        </div>

        <div className="dashboard-card">
          <Users size={22} />
          <h4>Sessions</h4>
          <h2>{totalSessions}</h2>
        </div>

        <div className="dashboard-card">
          <Timer size={22} />
          <h4>Avg Time</h4>
          <h2>{avgSession.toFixed(2)}s</h2>
        </div>

        <div className="dashboard-card">
          <TrendingUp size={22} />
          <h4>Bounce Rate</h4>
          <h2>{bounceRate.toFixed(2)}%</h2>
        </div>

      </div>

      {/* 🔥 CHARTS */}
      <div className="charts">

        {/* LINE */}
        <div className="chart-card">
          <h3>Views Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="chart-card">
          <h3>Top Articles</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DONUT */}
        <div className="chart-card">
          <h3>Bounce Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
      <div className="bottom-section">

        {/* 🔥 TABLE */}
        <div className="table-card">
          <h3>All Articles Analytics</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Article</th>
                  <th>Views</th>
                  <th>Sessions</th>
                  <th>Bounce</th>
                </tr>
              </thead>

              <tbody>
                {stats.map((item, i) => (
                  <tr key={item._id}>
                    <td className="row-index">{i + 1}</td>

                    {/* ✅ SLUG → CLEAN TEXT */}
                    <td className="article-cell">
                      {item.articleSlug?.replace(/-/g, " ")}
                    </td>

                    <td>{item.totalViews}</td>
                    <td>{item.totalSessions || 0}</td>
                    <td>{item.bounceRate || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔥 RIGHT SIDE - TOP TRENDING */}
        <div className="trending-card">
          <h3>Top 5 Trending</h3>

          {stats.slice(0, 5).map((item, i) => (
            <div className="trend-item" key={item._id}>

              <span className="rank">{i + 1}</span>

              <div>
                <p>
                  {item.articleSlug?.replace(/-/g, " ")}
                </p>
                <small>{item.totalViews} views</small>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>


  );
}

export default Analytics;