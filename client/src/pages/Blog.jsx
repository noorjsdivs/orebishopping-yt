import {
  IoCalendarOutline,
  IoBookOutline,
  IoPencilOutline,
} from "react-icons/io5";
import Container from "../components/Container";
import Breadcrumbs from "../components/Breadcrumbs";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <Breadcrumbs currentPage="Blog" />

        <div className="max-w-4xl mx-auto text-center">
          {/* Coming Soon Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 rounded-full mb-6">
              <IoBookOutline className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Blog Coming Soon
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re working hard to bring you amazing content about
              fashion, style tips, and the latest trends. Stay tuned!
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <IoPencilOutline className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Style Guides
              </h3>
              <p className="text-gray-600">
                Expert fashion advice and styling tips to help you look your
                best.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <IoCalendarOutline className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seasonal Trends
              </h3>
              <p className="text-gray-600">
                Stay updated with the latest fashion trends and seasonal
                collections.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <IoBookOutline className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Brand Stories
              </h3>
              <p className="text-gray-600">
                Discover the stories behind your favorite brands and designers.
              </p>
            </div>
          </div>

          {/* Mockup Blog Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              What to Expect
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mock Blog Post 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-600"></div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <IoCalendarOutline className="w-4 h-4 mr-1" />
                    Coming Soon
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    10 Must-Have Fashion Pieces for Every Season
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover the essential fashion pieces that will keep you
                    stylish throughout the year...
                  </p>
                </div>
              </div>

              {/* Mock Blog Post 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-teal-600"></div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <IoCalendarOutline className="w-4 h-4 mr-1" />
                    Coming Soon
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How to Build a Capsule Wardrobe on a Budget
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Learn how to create a versatile and stylish wardrobe without
                    breaking the bank...
                  </p>
                </div>
              </div>

              {/* Mock Blog Post 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                <div className="h-48 bg-gradient-to-r from-yellow-400 to-orange-600"></div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <IoCalendarOutline className="w-4 h-4 mr-1" />
                    Coming Soon
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sustainable Fashion: Making Eco-Friendly Choices
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Explore how to make more sustainable fashion choices that
                    are good for you and the planet...
                  </p>
                </div>
              </div>

              {/* Mock Blog Post 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                <div className="h-48 bg-gradient-to-r from-green-400 to-blue-600"></div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <IoCalendarOutline className="w-4 h-4 mr-1" />
                    Coming Soon
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Styling Tips from Fashion Experts
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get insider tips from professional stylists on how to
                    elevate your everyday looks...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Be the First to Know
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to get notified when our blog launches
              and receive exclusive fashion content.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <button className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>

          {/* Back to Shopping */}
          <div className="mt-12">
            <p className="text-gray-600 mb-4">
              While you wait, check out our latest products!
            </p>
            <a
              href="/shop"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Shop Now
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Blog;
