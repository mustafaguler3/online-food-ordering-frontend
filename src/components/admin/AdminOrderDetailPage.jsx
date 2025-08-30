import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useError } from "../common/ErrorDisplay";

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await ApiService.getOrderById(id);
      if (response.statusCode === 200) {
        setOrder(response.data);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await ApiService.updateOrderStatus({
        id: id,
        orderStatus: newStatus,
      });

      if (response.statusCode === 200) {
        fetchOrder();
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  if (order) {
    return (
      <div className="admin-order-detail">
        <ErrorDisplay />
        <div className="content-header">
          <h1>Order Details #{order.id}</h1>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/orders")}
          >
            Back to Orders
          </button>
        </div>

        <div className="order-summary">
          <div className="order-info">
            <div className="info-row">
              <span className="label">Order Date:</span>
              <span className="value">
                {new Date(order.orderDate).toLocaleString()}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`status ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Payment Status:</span>
              <span
                className={`payment-status ${
                  order.paymentStatus?.toLowerCase() || "initialized"
                }`}
              >
                {order.paymentStatus || "INITIALIZED"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Total Amount:</span>
              <span className="value">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="customer-info">
            <h3>Customer Information</h3>
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{order.user.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{order.user.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span className="value">{order.user.phoneNumber}</span>
            </div>
            <div className="info-row">
              <span className="label">Address:</span>
              <span className="value">{order.user.address}</span>
            </div>
          </div>
        </div>

        <div className="order-items">
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="item-details">
                      <img
                        src={`http://localhost:8080/`+item.menu.imageUrl}
                        alt={item.menu.name}
                        className="item-image"
                      />
                      <div>
                        <div className="item-name">{item.menu.name}</div>
                        <div className="item-description">
                          {item.menu.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>${item.pricePerUnit.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-actions">
          <h3>Update Order Status</h3>
          <select
            value={order.orderStatus}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="status-select"
          >
            <option value="INITIALIZED">Initialized</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ON_THE_WAY">On the way</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>
    );
  }
};
export default AdminOrderDetailPage;
