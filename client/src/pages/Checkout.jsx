import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import PriceFormat from "../components/PriceFormat";
import StripePayment from "../components/StripePayment";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaCreditCard,
  FaMoneyBillWave,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
} from "react-icons/fa";

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState("selection"); // 'selection', 'stripe', 'processing'

  const fetchOrderDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/order/user/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error("Order not found");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, fetchOrderDetails]);

  const handlePayment = async (paymentMethod) => {
    if (paymentMethod === "stripe") {
      setPaymentStep("stripe");
    } else if (paymentMethod === "cod") {
      toast.success("Order confirmed with Cash on Delivery");
    }
  };

  const handleStripeSuccess = (paymentIntentId) => {
    // Redirect to success page with payment details
    navigate(
      `/payment-success?order_id=${orderId}&payment_intent=${paymentIntentId}`
    );
  };

  const handleStripeCancel = () => {
    setPaymentStep("selection");
  };

  const handlePayOnline = () => {
    setPaymentStep("stripe");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
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
            The requested order could not be found.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-8">
          <div className="flex items-center gap-3 mb-4">
            <FaCheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Confirmation
              </h1>
              <p className="text-gray-600">Order ID: #{order._id}</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Status
              </h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Order Status:
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Payment:
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <div key={index} className="p-6 flex items-center space-x-4">
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
                        <PriceFormat amount={item.price} />
                      </div>
                      <div className="text-sm text-gray-600">
                        Total:{" "}
                        <PriceFormat amount={item.price * item.quantity} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="w-5 h-5" />
                Delivery Address
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">
                    {order.address.firstName} {order.address.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{order.address.email}</span>
                </div>
                {order.address.phone && (
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{order.address.phone}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="text-gray-600">
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.state}{" "}
                      {order.address.zipcode}
                    </p>
                    <p>{order.address.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment
              </h2>

              {/* Order Summary */}
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
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    <PriceFormat amount={order.amount} />
                  </span>
                </div>
              </div>

              {/* Payment Options */}
              {order.paymentStatus === "pending" && (
                <div className="space-y-4">
                  {paymentStep === "selection" && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Choose Payment Method
                      </h3>

                      {order.paymentMethod === "cod" ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FaMoneyBillWave className="w-6 h-6 text-green-600" />
                              <div>
                                <h4 className="font-semibold text-green-800">
                                  Cash on Delivery
                                </h4>
                                <p className="text-sm text-green-700">
                                  Pay when your order is delivered
                                </p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handlePayOnline}
                            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            <FaCreditCard className="w-5 h-5" />
                            Pay Online Now
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePayment("stripe")}
                            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            <FaCreditCard className="w-5 h-5" />
                            Pay with Card
                          </button>

                          <button
                            onClick={() => handlePayment("cod")}
                            className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            <FaMoneyBillWave className="w-5 h-5" />
                            Cash on Delivery
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {paymentStep === "stripe" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={handleStripeCancel}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <FaArrowLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Payment Details
                        </h3>
                      </div>

                      <StripePayment
                        orderId={orderId}
                        amount={order.amount}
                        onSuccess={handleStripeSuccess}
                        onCancel={handleStripeCancel}
                      />
                    </div>
                  )}
                </div>
              )}

              {order.paymentStatus === "paid" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        Payment Completed
                      </h4>
                      <p className="text-sm text-green-700">
                        Your payment has been processed successfully
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Checkout;
