/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import ApiService from "../../services/ApiService";
import ClipLoader from "react-spinners/ClipLoader";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ApiService.getMyOrders();
        const enhancedOrders = [];
        console.log("Response order : ", response.data);
        for (const order of response.data) {
          const enhancedItems = [];
          console.log("Response order data: ", order);
          for (const item of order.orderItems) {
            const itemResponse = await ApiService.getOrderItemById(item.id);
            if (itemResponse.statusCode === 200) {
              enhancedItems.push({
                ...item,
                hasReview: itemResponse.data.menu.reviews.some(
                  (review) => review.orderId === order.id
                ),
              });
            } else {
              enhancedItems.push(item);
            }
          }
          enhancedOrders.push({ ...order, orderItems: enhancedItems });
        }
        setOrders(enhancedOrders);
        console.log("Enhanced Orders: ", enhancedOrders);
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const handleLeaveReview = (orderId, menuId) => {
    navigate(`/leave-review?orderId=${orderId}&menuId=${menuId}`);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#6c63ff" size={60} />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="order-history-container">
        <div className="no-orders-message">
          <p>You have no previous orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <ErrorDisplay />
      <h1 className="order-history-title">Your Order History</h1>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">Order ID: {order.id}</span>
              <span className="order-date">
                Date: {formatDate(order.orderDate)}
              </span>
              <span className="order-status">
                Status:{" "}
                <span className={`status-${order.orderStatus.toLowerCase()}`}>
                  {order.orderStatus}
                </span>
              </span>
              <span className="order-total">
                Total: ${order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="order-items">
              <h2 className="order-items-title">Order Items:</h2>
              {order.orderItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <span className="item-name">{item.menu.name}</span>
                    <span className="item-quantity">
                      Quantity: {item.quantity}
                    </span>
                    <span className="item-price">
                      Price: ${item.pricePerUnit.toFixed(2)}
                    </span>
                    <span className="subtotal">
                      Subtotal: ${item.subtotal.toFixed(2)}
                    </span>
                    {order.orderStatus.toLowerCase() === "delivered" &&
                      !item.hasReview && (
                        <button
                          className="review-button"
                          onClick={() =>
                            handleLeaveReview(order.id, item.menu.id)
                          }
                        >
                          Leave Review
                        </button>
                      )}
                  </div>
                  <div className="item-image-container">
                    <img
                      src={item.menu.imageUrl}
                      alt={item.menu.name}
                      className="item-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderHistoryPage;
