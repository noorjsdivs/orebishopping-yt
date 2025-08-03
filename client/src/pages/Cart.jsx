import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  resetCart,
  deleteItem,
  increaseQuantity,
  decreaseQuantity,
  setOrderCount,
} from "../redux/orebiSlice";
import { emptyCart } from "../assets/images";
import Container from "../components/Container";
import PriceFormat from "../components/PriceFormat";
import toast from "react-hot-toast";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaMapMarkerAlt,
  FaTimes,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const orderCount = useSelector((state) => state.orebiReducer.orderCount);
  const [totalAmt, setTotalAmt] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddressesExpanded, setIsAddressesExpanded] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    let price = 0;
    let discountedPrice = 0;
    products.forEach((item) => {
      const itemPrice = item?.price || 0;
      const itemQuantity = item?.quantity || 1;
      const itemDiscountPercentage = item?.discountedPercentage || 0;

      price +=
        (itemPrice + (itemDiscountPercentage * itemPrice) / 100) * itemQuantity;
      discountedPrice += itemPrice * itemQuantity;
    });
    setTotalAmt(price);
    setDiscount(discountedPrice);
  }, [products]);

  // Fetch user addresses
  useEffect(() => {
    if (userInfo) {
      fetchAddresses();
    }
  }, [userInfo]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/user/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
        // Set default address as selected
        const defaultAddr = data.addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsAddingAddress(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/user/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Address added successfully!");
        fetchAddresses();
        setShowAddressModal(false);
        setAddressForm({
          label: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phone: "",
          isDefault: false,
        });
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    console.log("hello");

    if (!userInfo) {
      toast.error("Please login to place an order");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: products,
          amount: discount, // Use the discounted amount as final total
          address: {
            ...selectedAddress,
            email: userInfo.email,
            name: userInfo.name,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Order placed successfully!");
        dispatch(resetCart());
        // Update order count
        dispatch(setOrderCount(orderCount + 1));
        // Redirect to orders page or checkout page
        window.location.href = `/checkout/${data.orderId}`;
      } else {
        console.log("error", data);

        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleQuantityChange = (id, action) => {
    if (action === "increase") {
      dispatch(increaseQuantity(id));
    } else {
      dispatch(decreaseQuantity(id));
    }
  };

  const handleRemoveItem = (id, name) => {
    dispatch(deleteItem(id));
    toast.success(`${name} removed from cart!`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <Container className="py-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <nav className="flex text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700 transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Cart</span>
            </nav>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Takes 2/3 of the width on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden lg:grid grid-cols-10 gap-4 p-6 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700 uppercase">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-1 text-center">Total</div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                  {products.map((item) => (
                    <div key={item._id} className="p-4 lg:p-6">
                      {/* Mobile Layout */}
                      <div className="lg:hidden">
                        <div className="flex space-x-4">
                          {/* Product Image - Clickable */}
                          <Link
                            to={`/product/${item._id}`}
                            className="flex-shrink-0 group"
                          >
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={item?.images?.[0] || item?.image}
                                alt={item?.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item._id}`}
                              className="block hover:text-gray-700"
                            >
                              <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                                {item?.name}
                              </h3>
                            </Link>

                            <div className="flex flex-wrap gap-2 mb-2">
                              {item?.brand && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {item.brand}
                                </span>
                              )}
                              {item?.category && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {item.category}
                                </span>
                              )}
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                              <div className="text-lg font-bold text-gray-900">
                                <PriceFormat amount={item?.price || 0} />
                              </div>
                              {item?.offer &&
                                item?.discountedPercentage > 0 && (
                                  <div className="text-sm text-gray-500 line-through">
                                    <PriceFormat
                                      amount={
                                        (item?.price || 0) +
                                        ((item?.discountedPercentage || 0) *
                                          (item?.price || 0)) /
                                          100
                                      }
                                    />
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Mobile Controls */}
                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(item._id, "decrease")
                              }
                              disabled={(item?.quantity || 1) <= 1}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center border-x border-gray-300">
                              {item?.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item._id, "increase")
                              }
                              className="p-2 hover:bg-gray-50 transition-colors rounded-r-lg"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Subtotal and Remove */}
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                <PriceFormat
                                  amount={
                                    (item?.price || 0) * (item?.quantity || 1)
                                  }
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                Subtotal
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveItem(item._id, item.name)
                              }
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:grid lg:grid-cols-10 gap-4 items-center">
                        {/* Product Info */}
                        <div className="lg:col-span-5">
                          <div className="flex items-start space-x-4">
                            <Link
                              to={`/product/${item._id}`}
                              className="flex-shrink-0 group"
                            >
                              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={item?.images?.[0] || item?.image}
                                  alt={item?.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${item._id}`}
                                className="block hover:text-gray-700"
                              >
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                  {item?.name}
                                </h3>
                              </Link>
                              {item?.brand && (
                                <p className="text-sm text-gray-600 mb-1">
                                  Brand: {item.brand}
                                </p>
                              )}
                              {item?.category && (
                                <p className="text-sm text-gray-600">
                                  Category: {item.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="lg:col-span-2">
                          <div className="flex lg:justify-center">
                            <div className="lg:text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                <PriceFormat amount={item?.price || 0} />
                              </div>
                              {item?.offer &&
                                item?.discountedPercentage > 0 && (
                                  <div className="text-sm text-gray-500 line-through">
                                    <PriceFormat
                                      amount={
                                        (item?.price || 0) +
                                        ((item?.discountedPercentage || 0) *
                                          (item?.price || 0)) /
                                          100
                                      }
                                    />
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="lg:col-span-2">
                          <div className="flex lg:justify-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item._id, "decrease")
                                }
                                disabled={(item?.quantity || 1) <= 1}
                                className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <FaMinus className="w-3 h-3" />
                              </button>
                              <span className="px-4 py-3 font-medium min-w-[3rem] text-center">
                                {item?.quantity || 1}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item._id, "increase")
                                }
                                className="p-3 hover:bg-gray-50 transition-colors"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="lg:col-span-1">
                          <div className="flex lg:justify-center items-center">
                            <div className="lg:text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                <PriceFormat
                                  amount={
                                    (item?.price || 0) * (item?.quantity || 1)
                                  }
                                />
                              </div>
                            </div>
                            {/* Remove button for desktop */}
                            <button
                              onClick={() =>
                                handleRemoveItem(item._id, item.name)
                              }
                              className="hidden lg:block ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Actions - Below cart items on large screens */}
              <div className="mt-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Cart Actions
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => dispatch(resetCart())}
                      className="flex-1 px-4 py-3 border border-red-300 text-red-700 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors font-medium"
                    >
                      Clear Cart
                    </button>
                    <Link to="/shop" className="flex-1">
                      <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium">
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Takes 1/3 of the width on large screens */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
                {/* Address Selection Section */}
                {userInfo && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Delivery Address
                      </h3>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Add New
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FaMapMarkerAlt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-2">
                          No delivery address found
                        </p>
                        <button
                          onClick={() => setShowAddressModal(true)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Add your first address
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Selected Address Display */}
                        {selectedAddress && (
                          <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm text-gray-900">
                                    {selectedAddress.label}
                                  </span>
                                  {selectedAddress.isDefault && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                    Selected
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {selectedAddress.street},{" "}
                                  {selectedAddress.city},{" "}
                                  {selectedAddress.state}{" "}
                                  {selectedAddress.zipCode}
                                  {selectedAddress.phone && (
                                    <span className="block">
                                      Phone: {selectedAddress.phone}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <FaCheck className="w-4 h-4 text-blue-600 mt-1" />
                            </div>
                          </div>
                        )}

                        {/* Collapsible Address List */}
                        {addresses.length > 1 && (
                          <div className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() =>
                                setIsAddressesExpanded(!isAddressesExpanded)
                              }
                              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-700">
                                {isAddressesExpanded ? "Hide" : "Show"} other
                                addresses ({addresses.length - 1})
                              </span>
                              {isAddressesExpanded ? (
                                <FaChevronUp className="w-4 h-4 text-gray-400" />
                              ) : (
                                <FaChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </button>

                            {isAddressesExpanded && (
                              <div className="border-t border-gray-200 p-2 space-y-2">
                                {addresses
                                  .filter(
                                    (address) =>
                                      address._id !== selectedAddress?._id
                                  )
                                  .map((address) => (
                                    <div
                                      key={address._id}
                                      className="border border-gray-200 rounded-lg p-3 cursor-pointer transition-colors hover:border-gray-300 hover:bg-gray-50"
                                      onClick={() =>
                                        setSelectedAddress(address)
                                      }
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm text-gray-900">
                                              {address.label}
                                            </span>
                                            {address.isDefault && (
                                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                                Default
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-600 leading-relaxed">
                                            {address.street}, {address.city},{" "}
                                            {address.state} {address.zipCode}
                                            {address.phone && (
                                              <span className="block">
                                                Phone: {address.phone}
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Single Address Display (when only one address exists) */}
                        {addresses.length === 1 && !selectedAddress && (
                          <div
                            className="border border-gray-200 rounded-lg p-3 cursor-pointer transition-colors hover:border-gray-300"
                            onClick={() => setSelectedAddress(addresses[0])}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm text-gray-900">
                                    {addresses[0].label}
                                  </span>
                                  {addresses[0].isDefault && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {addresses[0].street}, {addresses[0].city},{" "}
                                  {addresses[0].state} {addresses[0].zipCode}
                                  {addresses[0].phone && (
                                    <span className="block">
                                      Phone: {addresses[0].phone}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">
                      Subtotal ({products.length} items)
                    </span>
                    <span className="font-medium">
                      <PriceFormat amount={totalAmt} />
                    </span>
                  </div>

                  {totalAmt !== discount && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -<PriceFormat amount={totalAmt - discount} />
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        <PriceFormat amount={discount} />
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!userInfo || !selectedAddress || isPlacingOrder}
                  className="w-full bg-gray-900 text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!userInfo ? (
                    "Login to Place Order"
                  ) : !selectedAddress ? (
                    "Select Address to Continue"
                  ) : isPlacingOrder ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <img
                className="w-32 h-32 mx-auto mb-6 object-cover"
                src={emptyCart}
                alt="Empty Cart"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven&apos;t added any items to your cart yet.
                Start shopping to fill it up!
              </p>
              <Link to="/shop">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
                  Start Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </Container>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Add New Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Label *
                </label>
                <div className="relative">
                  <select
                    value={addressForm.label}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, label: e.target.value })
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Select address type</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Hometown">Hometown</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  placeholder="House number and street name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={addressForm.zipCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        zipCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    placeholder="e.g., United States"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 text-sm text-gray-700"
                >
                  Set as default address
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingAddress}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isAddingAddress ? "Adding..." : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
