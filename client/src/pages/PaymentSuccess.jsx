import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Container from "../components/Container";
import PriceFormat from "../components/PriceFormat";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaShoppingBag,
  FaHome,
  FaListAlt,
  FaPrint,
  FaShare,
  FaTruck,
  FaCalendarAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order_id");
  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    const confirmPaymentAndFetchOrder = async () => {
      if (!orderId || !paymentIntentId) {
        toast.error("Invalid payment confirmation");
        navigate("/orders");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        // Confirm payment with backend
        const confirmResponse = await fetch(
          "http://localhost:8000/api/payment/stripe/confirm-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              paymentIntentId,
              orderId,
            }),
          }
        );

        const confirmData = await confirmResponse.json();
        if (confirmData.success) {
          setOrder(confirmData.order);
          toast.success("Payment confirmed successfully!");
        } else {
          toast.error(confirmData.message || "Payment confirmation failed");
          navigate("/orders");
        }
      } catch (error) {
        console.error("Payment confirmation error:", error);
        toast.error("Failed to confirm payment");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    confirmPaymentAndFetchOrder();
  }, [orderId, paymentIntentId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order Confirmation - ${order._id}`,
          text: `My order for $${order.amount} has been confirmed!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to confirm your payment. Please contact support.
          </p>
          <Link
            to="/orders"
            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <Container className="py-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaCheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl opacity-90 mb-2">
              Thank you for your purchase
            </p>
            <p className="text-lg opacity-80">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Link
              to="/"
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all group"
            >
              <div className="text-center">
                <FaHome className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-900">Home</span>
              </div>
            </Link>

            <Link
              to="/shop"
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all group"
            >
              <div className="text-center">
                <FaShoppingBag className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-900">
                  Shop More
                </span>
              </div>
            </Link>

            <Link
              to="/orders"
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all group"
            >
              <div className="text-center">
                <FaListAlt className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-900">
                  My Orders
                </span>
              </div>
            </Link>

            <button
              onClick={handlePrint}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all group"
            >
              <div className="text-center">
                <FaPrint className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-900">Print</span>
              </div>
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Confirmation */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-green-800">
                          Payment Status
                        </div>
                        <div className="text-lg font-bold text-green-900">
                          PAID
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FaTruck className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">
                          Order Status
                        </div>
                        <div className="text-lg font-bold text-blue-900">
                          CONFIRMED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Paid on {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Items
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 flex items-center space-x-4"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          <PriceFormat amount={item.price * item.quantity} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-blue-50 rounded-lg border border-blue-200 p-6"
              >
                <h2 className="text-xl font-semibold text-blue-900 mb-4">
                  What&apos;s Next?
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">
                        Order Confirmation
                      </p>
                      <p className="text-sm text-blue-700">
                        You&apos;ll receive a confirmation email shortly with
                        your order details.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Processing</p>
                      <p className="text-sm text-blue-700">
                        We&apos;ll start processing your order within 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Shipping</p>
                      <p className="text-sm text-blue-700">
                        Track your order status in the &quot;My Orders&quot;
                        section.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({order.items.length} items)
                    </span>
                    <span className="font-medium">
                      <PriceFormat amount={order.amount} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total Paid</span>
                    <span className="text-green-600">
                      <PriceFormat amount={order.amount} />
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    <FaShare className="w-4 h-4" />
                    Share Order
                  </button>

                  <Link
                    to="/shop"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FaShoppingBag className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentSuccess;
