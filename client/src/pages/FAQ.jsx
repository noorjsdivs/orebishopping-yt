import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Container from "../components/Container";
import Breadcrumbs from "../components/Breadcrumbs";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqData = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) and overnight shipping are also available for an additional fee. International shipping times vary by location, typically 7-14 business days.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your orders by logging into your account and visiting the 'My Orders' section.",
        },
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for unused items in original packaging. Items must be returned within 30 days of delivery. Refunds will be processed within 5-7 business days after we receive your return.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by destination. Customers are responsible for any customs duties or taxes.",
        },
      ],
    },
    {
      category: "Products & Sizing",
      questions: [
        {
          question: "How do I know what size to order?",
          answer:
            "Each product page includes detailed size charts and measurements. You can also check our general sizing guide in the footer. If you're between sizes, we recommend sizing up. Our customer service team is happy to help with sizing questions.",
        },
        {
          question: "Are your products authentic?",
          answer:
            "Absolutely! We source all products directly from authorized distributors and brand partners. Every item comes with authenticity guarantees and original packaging.",
        },
        {
          question: "Do you offer product warranties?",
          answer:
            "Yes, all products come with manufacturer warranties. Warranty terms vary by brand and product type. Extended warranty options may be available at checkout for certain items.",
        },
        {
          question: "How often do you restock items?",
          answer:
            "We restock popular items regularly, typically every 2-4 weeks. You can sign up for restock notifications on any out-of-stock product page. Follow us on social media for the latest updates on new arrivals.",
        },
      ],
    },
    {
      category: "Account & Payment",
      questions: [
        {
          question: "Do I need an account to make a purchase?",
          answer:
            "While you can checkout as a guest, creating an account allows you to track orders, save items to your wishlist, store shipping addresses, and access exclusive member benefits.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely using industry-standard encryption.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes! We use SSL encryption and comply with PCI DSS standards to protect your payment information. We never store your credit card details on our servers.",
        },
        {
          question: "Can I save multiple shipping addresses?",
          answer:
            "Yes, registered users can save multiple shipping addresses in their account for faster checkout. You can add, edit, or delete addresses anytime in your account settings.",
        },
      ],
    },
    {
      category: "Customer Service",
      questions: [
        {
          question: "How can I contact customer service?",
          answer:
            "You can reach our customer service team via email at support@orebi.com, phone at 1-800-OREBI-SHOP, or through our live chat feature. We're available Monday-Friday 9AM-6PM EST.",
        },
        {
          question: "What if I receive a damaged item?",
          answer:
            "We're sorry if you received a damaged item! Please contact us within 48 hours of delivery with photos of the damage. We'll arrange for a replacement or full refund immediately.",
        },
        {
          question: "Can I cancel or modify my order?",
          answer:
            "Orders can be cancelled or modified within 1 hour of placement. After that, orders enter our fulfillment process and cannot be changed. Please contact customer service as soon as possible if you need to make changes.",
        },
        {
          question: "Do you offer price matching?",
          answer:
            "Yes! We offer price matching on identical items from authorized retailers. The item must be in stock and the competitor's price must be verifiable. Contact customer service with the details for price match requests.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <Breadcrumbs currentPage="FAQ" />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about shopping with Orebi. Cannot
              find what you&apos;re looking for? Contact our customer service
              team.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqData.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gray-900 text-white px-6 py-4">
                  <h2 className="text-xl font-semibold">{category.category}</h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {category.questions.map((item, questionIndex) => {
                    const itemKey = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openItems[itemKey];

                    return (
                      <div
                        key={questionIndex}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <button
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                          onClick={() => toggleItem(itemKey)}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 pr-4">
                              {item.question}
                            </h3>
                            {isOpen ? (
                              <IoChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <IoChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help you with any questions
              or concerns.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200"
              >
                Contact Us
              </a>
              <a
                href="mailto:support@orebi.com"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQ;
