import { useState } from "react";
import PropTypes from "prop-types";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FaCreditCard, FaLock, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

// Initialize Stripe
// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ orderId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Create payment intent
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/payment/stripe/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        }
      );

      const { clientSecret, success, message } = await response.json();

      if (!success) {
        setCardError(message || "Payment setup failed");
        setIsProcessing(false);
        return;
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setCardError(error.message);
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        // Redirect to success page
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCardError("Payment processing failed. Please try again.");
      toast.error("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "18px",
        color: "#ffffff",
        fontWeight: "500",
        fontFamily: "'Courier New', monospace",
        "::placeholder": {
          color: "#ffffff80",
        },
      },
      invalid: {
        color: "#ff6b6b",
        iconColor: "#ff6b6b",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Credit Card Design */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Card Information
        </label>

        {/* Credit Card Container */}
        <div className="relative w-full max-w-sm mx-auto">
          {/* Card Background with Gradient */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            {/* Card Pattern/Texture */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl"></div>

            {/* Chip */}
            <div className="relative mb-8">
              <div className="w-12 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md shadow-md flex items-center justify-center">
                <div className="w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm"></div>
              </div>
            </div>

            {/* Card Number Area */}
            <div className="relative mb-6">
              <div className="text-white text-xs font-medium mb-2 opacity-80">
                CARD NUMBER
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <CardElement
                  options={cardStyle}
                  onChange={(event) => {
                    setCardError(event.error ? event.error.message : null);
                  }}
                />
              </div>
            </div>

            {/* Card Holder & Expiry */}
            <div className="relative flex justify-between items-end">
              <div>
                <div className="text-white text-xs font-medium mb-1 opacity-80">
                  CARD HOLDER
                </div>
                <div className="text-white text-sm font-semibold tracking-wider">
                  YOUR NAME
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-xs font-medium mb-1 opacity-80">
                  VALID THRU
                </div>
                <div className="text-white text-sm font-semibold">MM/YY</div>
              </div>
            </div>

            {/* Card Brand Logo Area */}
            <div className="absolute top-4 right-4">
              <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
                <FaCreditCard className="w-6 h-6 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {cardError && (
          <p className="text-red-600 text-sm mt-3 text-center">{cardError}</p>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Amount to pay
          </span>
          <span className="text-lg font-bold text-gray-900">
            ${amount.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FaLock className="w-3 h-3" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <FaSpinner className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FaCreditCard className="w-4 h-4" />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <img
            src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
            alt="Visa"
            className="h-6"
          />
          <img
            src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
            alt="Mastercard"
            className="h-6"
          />
          <img
            src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd31dc8da3317e7849b70.svg"
            alt="American Express"
            className="h-6"
          />
        </div>
      </div>
    </form>
  );
};

const StripePayment = ({ orderId, amount, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaCreditCard className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Pay with Card</h3>
        </div>
        <CheckoutForm
          orderId={orderId}
          amount={amount}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </Elements>
  );
};

StripePayment.propTypes = {
  orderId: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

CheckoutForm.propTypes = {
  orderId: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default StripePayment;
