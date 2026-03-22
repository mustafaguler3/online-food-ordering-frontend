/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import Payment from "./Payment";

const ProcessPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    amount: 0,
  });

  useEffect(() => {
  const orderId = searchParams.get("orderId");
  const amountStr = searchParams.get("amount");

  if (!orderId || !amountStr) {
    showError("Missing order information in URL");
    return;
  }

  setOrderDetails({
    orderId,
    amount: Number(amountStr),
  });
}, [searchParams]);


  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setTimeout(() => {
      navigate("/my-order-history");
    }, 8000);
  };
  

  if (paymentCompleted) {
    return (
      <div className="payment-success">
        <h2>Payment Successful!</h2>
        <p>Thank you for your purchase. Order ID: {orderDetails.orderId}</p>
        <p>You will receive an email of your payment success</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <ErrorDisplay />
      <Payment
        amount={orderDetails.amount}
        orderId={orderDetails.orderId}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
export default ProcessPaymentPage;
