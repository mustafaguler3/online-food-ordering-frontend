import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import orderService from "../../services/orderService";
import { Order } from "../../models/Order";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");

  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response:any = await orderService.getOrders(
        filter === "all" ? null : filter
      );

      if (response.statusCode === 200) {
        setOrders(response.data.content);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleViewOrder = (id: number) => {
    navigate(`/admin/orders/${id}`);
  };

  return (
    <div className="admin-orders">
      <ErrorDisplay />
      <div className="content-header">
        <h1>Orders Management</h1>
        <div className="order-filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="INITIALIZED">Initialized</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ON_THE_WAY">On the way</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  {order.orderItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`status ${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <span
                    className={`payment-status ${
                      order.paymentStatus?.toLowerCase() || "pending"
                    }`}
                  >
                    {order.paymentStatus || "PENDING"}
                  </span>
                </td>
                <td className="actions">
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
    </div>
  );
};
export default AdminOrdersPage;
