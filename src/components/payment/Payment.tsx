import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useError } from "../common/ErrorDisplay";
import paymentService from '../../services/paymentService';

const stripeInstance = loadStripe(
  "pk_test_51LIGm5BJk0ZaKsmdyq1YUjfgcwEADWfhWcNTIMKWIv8LFk5XTq7its8TPtXRqWI2qXRJdyHUIAV4IMXUCqlwMDxU00xHqpGRcD"
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
      const paymentInitilizeResponse = await paymentService.proceedForPayment(body);

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
        const res = await paymentService.updateOrderPayment({
          orderId,
          amount,
          transactionId: paymentIntent.id,
          success: true,
        }); 
        onSuccess(paymentIntent);
        
        return res;
        
      } else {
        // Step 3: Update backend with payment completion
        const res = await paymentService.updateOrderPayment({
          orderId,
          amount,
          transactionId: paymentIntent.id,
          success: false,
        });
        return res;
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
