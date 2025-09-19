import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import deliveryService from "../../services/deliveryService";
import './DeliveryDashboardPage.css';

Chart.register(...registerables);

const DeliveryDashboardPage = () => {
  const [stats, setStats] = useState({
    assignedOrders: 0,
    completedOrders: 0,
    todayEarnings: 0,
    active: false,
    dailyEarnings: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await deliveryService.getDashboard();
      if (response.statusCode === 200) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to fetch dashboard data.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const pieData = {
    labels: ["Assigned Orders", "Completed Orders"],
    datasets: [
      {
        data: [stats.assignedOrders, stats.completedOrders],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const lineData = {
    labels: stats.dailyEarnings.map((d) => d.date),
    datasets: [
      {
        label: "Daily Earnings",
        data: stats.dailyEarnings.map((d) => d.earnings),
        fill: false,
        borderColor: "#36A2EB",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <p className="loading">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="error">
        <p>⚠️ {error}</p>
        <button onClick={fetchDashboard}>Retry</button>
      </div>
    );
  }

  return (
    <div className="delivery-dashboard">
      <h1>🚚 Courier Dashboard</h1>

      <div className="stats-cards">
        <div className="card">
          <h3>Assigned Orders</h3>
          <p>{stats.assignedOrders}</p>
        </div>
        <div className="card">
          <h3>Completed Orders</h3>
          <p>{stats.completedOrders}</p>
        </div>
        <div className="card">
          <h3>Today's Earnings</h3>
          <p>${stats.todayEarnings}</p>
        </div>
        <div className="card">
          <h3>Status</h3>
          <p>{stats.active ? "✅ On Delivery" : "❌ Idle"}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart">
          <h3>Orders Overview</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart">
          <h3>Daily Earnings</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboardPage;