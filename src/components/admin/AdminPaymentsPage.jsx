import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useError } from "../common/ErrorDisplay";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");

  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      const response = await ApiService.getAllPayments();

      if (response.statusCode === 200) {
        let filteredPayments = response.data;

        if (filter !== "all") {
          filteredPayments = filteredPayments.filter((p) =>
            filter === "completed"
              ? p.paymentStatus === "COMPLETED"
              : filter === "pending"
              ? p.paymentStatus === "PENDING"
              : filter === "failed"
              ? p.paymentStatus === "FAILED"
              : filteredPayments
          );
        }
        setPayments(filteredPayments);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleViewPayment = (id) => {
    navigate(`/admin/payments/${id}`);
  };

  return (
    <div className="admin-payments">
      <ErrorDisplay />
      <div className="content-header">
        <h1>Payments Management</h1>
        <div className="payment-filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="payments-table">
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Gateway</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>#{payment.id}</td>
                <td>#{payment.orderId}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status ${payment.paymentStatus.toLowerCase()}`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
                <td>{payment.paymentGateway}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleViewPayment(payment.id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="payment-stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">
            $
            {payments
              .reduce(
                (sum, p) =>
                  sum + (p.paymentStatus === "COMPLETED" ? p.amount : 0),
                0
              )
              .toFixed(2)}
          </p>
          <p className="stat-period">All Time</p>
        </div>
        <div className="stat-card">
          <h3>Online Payments</h3>
          <p className="stat-value">
            {payments.filter((p) => p.paymentGateway !== "CASH").length}
          </p>
          <p className="stat-period">Transactions</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">
            {payments.length > 0
              ? `${Math.round(
                  (payments.filter((p) => p.paymentStatus === "COMPLETED")
                    .length /
                    payments.length) *
                    100
                )}%`
              : "0%"}
          </p>
          <p className="stat-period">Completed</p>
        </div>
      </div>
    </div>
  );
};
export default AdminPaymentsPage;
