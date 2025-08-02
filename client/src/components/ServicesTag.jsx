import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { BiSupport } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    title: "Free Delivery",
    subtitle: "Free shipping on all orders over $50",
    icon: <TbTruckDelivery />,
    details: {
      description:
        "Enjoy free standard shipping on all orders over $50. We partner with reliable courier services to ensure your products reach you safely and on time.",
      features: [
        "Free shipping on orders $50+",
        "Standard delivery: 3-5 business days",
        "Express delivery available",
        "Real-time tracking",
        "Secure packaging",
      ],
    },
  },
  {
    title: "Easy Returns",
    subtitle: "30-day return guarantee",
    icon: <HiOutlineCurrencyDollar />,
    details: {
      description:
        "Not satisfied with your purchase? No problem! Our hassle-free return policy allows you to return any item within 30 days of purchase.",
      features: [
        "30-day return window",
        "Full refund guarantee",
        "Free return shipping",
        "Easy online return process",
        "No restocking fees",
      ],
    },
  },
  {
    title: "24/7 Support",
    subtitle: "Expert support anytime",
    icon: <BiSupport />,
    details: {
      description:
        "Our dedicated customer support team is available 24/7 to assist you with any questions, concerns, or issues you may have.",
      features: [
        "Round-the-clock availability",
        "Live chat support",
        "Email and phone support",
        "Expert product guidance",
        "Order tracking assistance",
      ],
    },
  },
  {
    title: "Secure Payment",
    subtitle: "100% secure transactions",
    icon: <MdOutlinePayment />,
    details: {
      description:
        "Shop with confidence knowing that all your transactions are protected by industry-leading security measures and encryption technology.",
      features: [
        "SSL encryption",
        "Multiple payment options",
        "Fraud protection",
        "PCI DSS compliance",
        "Secure checkout process",
      ],
    },
  },
];

const ServicesTag = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <section className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(item)}
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl text-white">{item?.icon}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                  {item?.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
                  {item?.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MdClose className="w-5 h-5 text-gray-500" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl text-white">
                    {selectedService.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedService.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedService.subtitle}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {selectedService.details.description}
                </p>

                <h4 className="font-semibold text-gray-900 mb-3">
                  Key Features:
                </h4>
                <ul className="space-y-2">
                  {selectedService.details.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <Link to="/shop" className="flex-1" onClick={closeModal}>
                  <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                    Shop Now
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesTag;
