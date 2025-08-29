import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import ApiService from "../../services/ApiService";
import { useError } from "../common/ErrorDisplay";

const stripeInstance = loadStripe(
  ""
);

const PaymentForm = ({ amount, orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const { ErrorDisplay, showError } = useError();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Initialize payment i.e Generate transaction ID from backend
      const body = {
        amount: amount,
        orderId: orderId,
      };
      const paymentInitilizeResponse = await ApiService.proceedForPayment(body);

      if (paymentInitilizeResponse.statusCode !== 200) {
        throw new Error(
          paymentInitilizeResponse.message || "Failed to initialize payment"
        );
      }

      const uniqueTransactionId = paymentInitilizeResponse.data;
      // Step 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(uniqueTransactionId, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              // Add any additional billing details you want
            },
          },
        });

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === "succeeded") {
        console.log("PAYMENT IS SUCCESSDED");

        // Step 3: Update backend with payment completion
        const res = await ApiService.updateOrderPayment({
          orderId,
          amount,
          transactionId: paymentIntent.id,
          success: true,
        });

        onSuccess(paymentIntent);
      } else {
        // Step 3: Update backend with payment completion
        const res = await ApiService.updateOrderPayment({
          orderId,
          amount,
          transactionId: paymentIntent.id,
          success: false,
        });
      }
    } catch (error) {
      console.log("Payment Error: " + error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <ErrorDisplay />
      <div className="form-group">
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="pay-button"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

const Payment = ({ amount, orderId, onSuccess }) => {
  console.log("Amount to pay in usd: " + amount);

  return (
    <div className="payment-container">
      <h2>Complete Payment</h2>
      <Elements stripe={stripeInstance}>
        <PaymentForm amount={amount} orderId={orderId} onSuccess={onSuccess} />
      </Elements>
    </div>
  );
};

export default Payment;
