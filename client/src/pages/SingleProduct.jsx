import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { MdStar, MdFavoriteBorder, MdShare } from "react-icons/md";
import { motion } from "framer-motion";
import { getData } from "../helpers/index";
import { serverUrl } from "../../config";

const SingleProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    setProductInfo(location.state.item);
  }, [location, productInfo]);

  // Fetch related products based on category
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (productInfo?.category) {
        setLoadingRelated(true);
        try {
          // Fetch products from the same category
          const response = await getData(
            `${serverUrl}/api/products?category=${productInfo.category}&_perPage=8`
          );

          if (response?.success && response?.products) {
            // Filter out the current product and limit to 4 products
            const filtered = response.products
              .filter((product) => product._id !== productInfo._id)
              .slice(0, 4);
            setRelatedProducts(filtered);
          }
        } catch (error) {
          console.error("Error fetching related products:", error);
        } finally {
          setLoadingRelated(false);
        }
      }
    };

    fetchRelatedProducts();
  }, [productInfo]);

  // Use product images from database if available, otherwise use mock images
  const productImages =
    productInfo?.images && productInfo.images.length > 0
      ? productInfo.images
      : [
          productInfo?.image,
          productInfo?.image,
          productInfo?.image,
          productInfo?.image,
        ].filter((img) => img); // Filter out undefined images

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Container className="py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <span className="hover:text-gray-700 cursor-pointer">Home</span>
          <span>/</span>
          <span className="hover:text-gray-700 cursor-pointer capitalize">
            {productInfo?.category}
          </span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{productInfo?.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div
              className="aspect-square overflow-hidden bg-gray-50 rounded-lg cursor-zoom-in relative group"
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              <img
                src={productImages[selectedImage] || "/placeholder-image.jpg"}
                alt={productInfo?.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isImageZoomed
                    ? "scale-150 cursor-zoom-out"
                    : "hover:scale-105 group-hover:scale-105"
                }`}
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              {!isImageZoomed && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    Click to zoom
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden bg-gray-50 rounded-lg border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder-image.jpg"}
                    alt={`${productInfo?.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight">
              {productInfo?.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              {productInfo?.oldPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  ${productInfo.oldPrice}
                </span>
              )}
              <span className="text-3xl font-light text-gray-900">
                ${productInfo?.price}
              </span>
              {productInfo?.oldPrice && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Save ${(productInfo.oldPrice - productInfo.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <MdStar
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(productInfo?.ratings || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Rated {productInfo?.ratings?.toFixed(1) || "0.0"} out of 5 based
                on {productInfo?.reviews?.length || 0} customer reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-lg">
              {productInfo?.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-900">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 px-8 rounded-md hover:bg-gray-800 transition-all duration-300 font-medium uppercase tracking-wider transform hover:scale-[1.02] active:scale-[0.98]">
                Add to Cart
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <MdFavoriteBorder className="w-5 h-5" />
                Add to Wishlist
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <MdShare className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Product Meta */}
            <div className="space-y-2 pt-4 border-t border-gray-200 text-sm">
              <p>
                <span className="font-medium">SKU:</span>{" "}
                <span className="text-gray-600">
                  {productInfo?._id?.slice(-6) || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-medium">Category:</span>{" "}
                <span className="text-gray-600 capitalize">
                  {productInfo?.category}
                </span>
              </p>
              {productInfo?.tags && (
                <p>
                  <span className="font-medium">Tags:</span>{" "}
                  <span className="text-gray-600">{productInfo.tags}</span>
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-200 pt-12"
        >
          {/* Tab Navigation */}
          <div className="flex space-x-8 mb-8 border-b border-gray-200">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors relative ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "reviews"
                  ? `Reviews (${productInfo?.reviews?.length || 0})`
                  : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-light mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {productInfo?.description || "No description available."}
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut
                  ullamcorper leo, eget euismod orci. Cum sociis natoque
                  penatibus et magnis dis parturient montes nascetur ridiculus
                  mus. Vestibulum ultricies aliquam convallis. Maecenas ut
                  tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante
                  metus lacinia tellus, vitae condimentum nulla enim bibendum
                  nibh.
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-light mb-6">Customer Reviews</h3>
                {productInfo?.reviews?.length > 0 ? (
                  <div className="space-y-6">
                    {productInfo.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={review.image}
                            alt={review.reviewerName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {review.reviewerName}
                              </h4>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map(
                                  (_, starIndex) => (
                                    <MdStar
                                      key={starIndex}
                                      className={`w-4 h-4 ${
                                        starIndex < review.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No reviews yet. Be the first to leave a review!
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-200 pt-16 mt-16"
        >
          <h2 className="text-2xl font-light text-center mb-12">
            Related Products
          </h2>

          {loadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="group cursor-pointer"
                  onClick={() =>
                    navigate(`/product/${product._id}`, {
                      state: { item: product },
                    })
                  }
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={
                        product.image ||
                        product.images?.[0] ||
                        "/placeholder-image.jpg"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <MdStar
                          key={starIndex}
                          className={`w-4 h-4 ${
                            starIndex < Math.floor(product.ratings || 4)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.ratings?.toFixed(1) || "4.0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {product.discountedPercentage > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        $
                        {(
                          product.price /
                          (1 - product.discountedPercentage / 100)
                        ).toFixed(2)}
                      </span>
                    )}
                    <span className="text-lg font-light text-gray-900">
                      ${product.price}
                    </span>
                    {product.discountedPercentage > 0 && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        {product.discountedPercentage}% off
                      </span>
                    )}
                  </div>
                  <button
                    className="w-full mt-3 py-2 border border-gray-300 text-gray-700 hover:border-black hover:text-black hover:bg-black hover:text-white transition-all duration-300 text-sm font-medium uppercase tracking-wider transform hover:scale-[1.02]"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle add to cart functionality here
                      console.log("Add to cart:", product.name);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No related products found.
              </p>
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default SingleProduct;
