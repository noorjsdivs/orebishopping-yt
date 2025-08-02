import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import InteractiveMap from "../components/InteractiveMap";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaUserCircle,
  FaLock,
  FaHistory,
  FaEye,
  FaComments,
  FaChevronDown,
  FaChevronUp,
  FaSync,
} from "react-icons/fa";
import { MdSend, MdMarkEmailRead, MdReply } from "react-icons/md";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Visit Our Store",
    content: ["3065 Broadway Street", "New York, NY 10027", "United States"],
  },
  {
    icon: <FaPhone />,
    title: "Call Us",
    content: ["Tel: (415) 225-0123", "Toll Free: 1-800-OREBI-US"],
  },
  {
    icon: <FaEnvelope />,
    title: "Email Us",
    content: ["support@orebi.com", "sales@orebi.com"],
  },
  {
    icon: <FaClock />,
    title: "Business Hours",
    content: ["Mon - Fri: 9:00 AM - 8:00 PM", "Sat - Sun: 10:00 AM - 6:00 PM"],
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // Get user authentication status from Redux
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const isLoggedIn = !!userInfo;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const fetchUserMessages = useCallback(async () => {
    if (!isLoggedIn) return;

    setLoadingMessages(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/contact/my-contacts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setUserMessages(data.data);
      } else {
        toast.error("Failed to load your messages");
      }
    } catch (error) {
      console.error("Fetch user messages error:", error);
      toast.error("Failed to load your messages");
    } finally {
      setLoadingMessages(false);
    }
  }, [isLoggedIn]);

  // Initialize form data when user logs in
  useEffect(() => {
    if (isLoggedIn && userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name || "",
        email: userInfo.email || "",
      }));
      fetchUserMessages();
    } else {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setUserMessages([]);
    }
  }, [isLoggedIn, userInfo, fetchUserMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to send a message");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Refetch messages to show the new one
        fetchUserMessages();
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">{info.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {info.title}
                </h3>
                <div className="space-y-1">
                  {info.content.map((line, i) => (
                    <p key={i} className="text-gray-600 text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                {/* Authentication Status */}
                {!isLoggedIn && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FaLock className="text-amber-600" />
                      <h3 className="font-semibold text-amber-800">
                        Authentication Required
                      </h3>
                    </div>
                    <p className="text-amber-700 mb-3">
                      To send us a message, you need to be logged in to your
                      account.
                    </p>
                    <Link
                      to="/signin"
                      className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors font-medium"
                    >
                      <FaUserCircle className="w-4 h-4" />
                      Log In Now
                    </Link>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">
                          Welcome, {userInfo?.name}!
                        </h3>
                        <p className="text-green-700 text-sm">
                          You can now send us a message.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  style={{ opacity: isLoggedIn ? 1 : 0.5 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={true} // Always disabled - auto-filled from profile
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors bg-gray-50 cursor-not-allowed"
                        placeholder={
                          isLoggedIn
                            ? "Auto-filled from your profile"
                            : "Please log in first"
                        }
                      />
                      {isLoggedIn && (
                        <p className="mt-1 text-xs text-gray-500">
                          Auto-filled from your profile. Update your profile to
                          change this.
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={true} // Always disabled - auto-filled from profile
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors bg-gray-50 cursor-not-allowed"
                        placeholder={
                          isLoggedIn
                            ? "Auto-filled from your profile"
                            : "Please log in first"
                        }
                      />
                      {isLoggedIn && (
                        <p className="mt-1 text-xs text-gray-500">
                          Auto-filled from your profile. Update your profile to
                          change this.
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={!isLoggedIn}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={!isLoggedIn}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isLoggedIn}
                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!isLoggedIn ? (
                      <>
                        <FaLock className="w-4 h-4" />
                        Login Required to Send Message
                      </>
                    ) : isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MdSend className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map & Store Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Interactive Map */}
              <InteractiveMap />

              {/* Store Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Visit Our Flagship Store
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Experience our products in person at our beautiful flagship
                    store in the heart of New York. Our knowledgeable staff is
                    ready to help you find exactly what you&apos;re looking for.
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">Store Features:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Interactive product demonstrations</li>
                      <li>• Personal shopping consultations</li>
                      <li>• Same-day pickup available</li>
                      <li>• Extended holiday hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Message History Section */}
      {isLoggedIn && (
        <section className="py-20 bg-gray-50">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaHistory className="text-2xl text-gray-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Your Message History
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={fetchUserMessages}
                      disabled={loadingMessages}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Refresh messages"
                    >
                      <FaSync
                        className={`w-4 h-4 ${
                          loadingMessages ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </button>
                    <button
                      onClick={() => setShowMessages(!showMessages)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {showMessages ? (
                        <>
                          <span>Hide Messages</span>
                          <FaChevronUp />
                        </>
                      ) : (
                        <>
                          <span>Show Messages ({userMessages.length})</span>
                          <FaChevronDown />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {showMessages && (
                  <div className="space-y-4">
                    {loadingMessages ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">
                          Loading your messages...
                        </p>
                      </div>
                    ) : userMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <FaComments className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Messages Yet
                        </h3>
                        <p className="text-gray-600">
                          Your sent messages will appear here. Send your first
                          message using the form above!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userMessages.map((message) => (
                          <div
                            key={message._id}
                            className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {message.subject}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                  <FaClock className="w-3 h-3" />
                                  Sent on{" "}
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                                    message.status === "unread"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : message.status === "read"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : "bg-green-100 text-green-800 border-green-200"
                                  }`}
                                >
                                  {message.status === "unread" && <FaEye />}
                                  {message.status === "read" && (
                                    <MdMarkEmailRead />
                                  )}
                                  {message.status === "replied" && <MdReply />}
                                  {message.status.charAt(0).toUpperCase() +
                                    message.status.slice(1)}
                                </span>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {message.message}
                              </p>
                            </div>

                            {message.adminNotes && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <MdReply className="text-green-600" />
                                  <h4 className="font-semibold text-green-800">
                                    Admin Reply
                                  </h4>
                                </div>
                                <p className="text-green-700 whitespace-pre-wrap">
                                  {message.adminNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* Careers Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join Our Team
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              We&apos;re always looking for talented individuals to join our
              growing team. Explore exciting career opportunities and help us
              shape the future of e-commerce.
            </p>
            <button className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold">
              Explore Careers
            </button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
