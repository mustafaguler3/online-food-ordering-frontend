import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

import { Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useError } from "../common/ErrorDisplay";
import orderService from "../../services/orderService";
import menuService from "../../services/menuService";
import paymentService from "../../services/paymentService";

Chart.register(...registerables);

const AdminDashboardPage = () => {
  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    menu: 0,
    recentOrders: [],
    orderStatusDistribution: {},
    revenueData: [],
    popularItems: [],
  });

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all necessary data from backend
      const ordersResponse:any = await orderService.getOrders();
      const menuResponse:any = await menuService.getMenus();
      const paymentsResponse:any = await paymentService.getPayments();

      const activeCustomerResponse =
        await ApiService.countTotalActiveCustomers();

      const activeCustomers = activeCustomerResponse.data;

      if (
        ordersResponse.statusCode === 200 &&
        menuResponse.statusCode === 200 &&
        paymentsResponse.statusCode === 200
      ) {
        const orders = ordersResponse.data.content;
        const menu = menuResponse.data;
        const payments = paymentsResponse.data;

        // Calculate statistics
        const totalOrders = orders.length;

        // Get recent orders (last 5)
        const recentOrders = orders.slice(0, 5);

        // Order status distribution
        const statusCounts = orders.reduce((acc, order) => {
          acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
          return acc;
        }, {});

        // Popular menu items
        const itemCounts = {};

        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            itemCounts[item.menu.name] =
              (itemCounts[item.menu.name] || 0) + item.quantity;
          });
        });

        const popularItems = 
        Object.entries(itemCounts)
          .sort((a:any, b:any) => b[1] - a[1])
          .slice(0, 5);

        //total revenue calculation
        const totalRevenue = payments.reduce(
          (sum, payment) =>
            payment.paymentStatus === "COMPLETED" ? sum + payment.amount : sum,
          0
        );

        // Revenue by month (simplified)
        const revenueByMonth = Array(12).fill(0);

        payments.forEach((payment) => {
          if (payment.paymentStatus === "COMPLETED") {
            const month = new Date(payment.paymentDate).getMonth();
            revenueByMonth[month] += payment.amount;
          }
        });

        setStats({
          totalOrders,
          totalRevenue,
          activeCustomers,
          menu: menu.length,
          recentOrders,
          orderStatusDistribution: statusCounts,
          revenueData: revenueByMonth,
          popularItems,
        });
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleViewOrder = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  // Revenue Chart data configurations

  const revenueChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Revenue ($)",
        data: stats.revenueData,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  //Orders destributin chart preparation and arrangements
  const statusChartData = {
    labels: Object.keys(stats.orderStatusDistribution),
    datasets: [
      {
        data: Object.values(stats.orderStatusDistribution),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <ErrorDisplay />
      <div className="content-header">
        <h1>Dashboard Overview</h1>
        <button className="refresh-btn" onClick={fetchDashboardData}>
          Refresh Data
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
          <p className="stat-change">All time</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
          <p className="stat-change">All time</p>
        </div>
        <div className="stat-card">
          <h3>Active Customers</h3>
          <p className="stat-value">{stats.activeCustomers}</p>
          <p className="stat-change">Recently ordered</p>
        </div>
        <div className="stat-card">
          <h3>Menu Items</h3>
          <p className="stat-value">{stats.menu}</p>
          <p className="stat-change">Available</p>
        </div>
      </div>

      {/* MONTHLY REVENUE CHART */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Monthly Revenue</h3>
          <div className="chart-container">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* ORDER DISTRIBUTIONS CHAT */}
        <div className="chart-card">
          <h3>Order Status Distribution</h3>
          <div className="chart-container">
            <Pie
              data={statusChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* RECENT ORDERS DISPLAY */}
      <div className="data-tables">
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.user?.name || "Guest"}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`status ${order.orderStatus.toLowerCase()}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOST POPULAR ITEMS DISPLAY */}
        <div className="popular-items">
          <h3>Most Popular Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {stats.popularItems.map(([name, count]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
