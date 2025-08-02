import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import {
  bannerImgOne,
  bannerImgThree,
  bannerImgTwo,
} from "../assets/images/index";
import "slick-carousel/slick/slick.css";
import Container from "./Container";
import PriceFormat from "./PriceFormat";
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const bannerData = [
  {
    title: "Premium Collection",
    subtitle: "Top selling smartphone and accessories",
    description:
      "Discover the latest in mobile technology with exclusive discounts",
    discount: "Up to 40% off",
    from: 599.99,
    sale: "Limited Time",
    image: bannerImgOne,
    buttonText: "Shop Collection",
  },
  {
    title: "Household Chairs",
    subtitle: "The best deals on Chairs",
    description: "Professional-grade chairs for creatives and professionals",
    discount: "$250 off",
    from: 2349.99,
    sale: "Special Offer",
    image: bannerImgTwo,
    buttonText: "Explore Home Decor",
  },
  {
    title: "Lighting Excellence",
    subtitle: "Premium lighting collection",
    description: "Experience crystal-clear light with our curated selection",
    discount: "Free shipping",
    from: 199.99,
    sale: "Weekend Deal",
    image: bannerImgThree,
    buttonText: "Shop Lights",
  },
];

const Banner = () => {
  const navigate = useNavigate();
  const [dotActive, setDocActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    cssEase: "linear",
    beforeChange: (prev, next) => {
      setDocActive(next);
    },
    appendDots: (dots) => (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ul className="flex items-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={`cursor-pointer transition-all duration-300 ${
          i === dotActive
            ? "w-8 h-2 bg-gray-800 rounded-full"
            : "w-2 h-2 bg-gray-600/50 rounded-full hover:bg-gray-600/75"
        }`}
      />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          fade: false,
          appendDots: (dots) => (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <ul className="flex items-center gap-2">{dots}</ul>
            </div>
          ),
          customPaging: (i) => (
            <div
              className={`cursor-pointer transition-all duration-300 ${
                i === dotActive
                  ? "w-6 h-1.5 bg-gray-800 rounded-full"
                  : "w-1.5 h-1.5 bg-gray-600/50 rounded-full hover:bg-gray-600/75"
              }`}
            />
          ),
        },
      },
    ],
  };
  return (
    <div
      className="w-full h-[70vh] min-h-[500px] max-h-[700px] relative overflow-hidden group bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Slider ref={sliderRef} {...settings}>
        {bannerData?.map((item, index) => (
          <div
            key={index}
            className="relative h-[70vh] min-h-[500px] max-h-[700px]"
          >
            <div className="relative z-10 h-full bg-[#F3F3F3]">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10"></div>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>

              <Container className="h-full relative z-10 py-8 md:py-0">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-5 h-full lg:items-center">
                  {/* Left Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4 lg:space-y-5 text-gray-800 order-2 lg:order-1 text-center lg:text-left"
                  >
                    {/* Sale Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-block"
                    >
                      <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                        {item?.sale}
                      </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight lg:leading-none bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent py-2"
                    >
                      {item?.title}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed"
                    >
                      {item?.subtitle}
                    </motion.p>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    >
                      {item?.description}
                    </motion.p>

                    {/* Discount & Price */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-4 lg:gap-6 py-2 lg:py-4"
                    >
                      <div className="flex items-center justify-center lg:justify-start">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text">
                          {item?.discount}
                        </div>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                        <span className="text-base sm:text-lg text-gray-600 font-medium">
                          Starting from
                        </span>
                        <PriceFormat
                          amount={item?.from}
                          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
                        />
                      </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="pt-2 lg:pt-4 flex justify-center lg:justify-start"
                    >
                      <button
                        onClick={() => navigate("/shop")}
                        className="group relative inline-flex items-center gap-3 lg:gap-4 px-8 lg:px-10 py-4 lg:py-5 bg-black text-white text-sm lg:text-base font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                          {item?.buttonText}
                        </span>
                        <svg
                          className="relative z-10 w-4 lg:w-5 h-4 lg:h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  </motion.div>

                  {/* Right Image */}
                  <motion.div
                    initial={{ opacity: 0, x: 60, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="relative order-1 lg:order-2 h-64 sm:h-80 lg:h-full flex items-center justify-center"
                  >
                    <div className="relative max-w-xs sm:max-w-sm lg:max-w-lg w-full">
                      {/* Glowing Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl transform rotate-6"></div>

                      {/* Image Container */}
                      <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200/30">
                        <img
                          src={item?.image}
                          alt={`Banner ${index + 1}`}
                          className="w-full h-auto max-h-48 sm:max-h-64 lg:max-h-[450px] object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Floating Elements */}
                      <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-10 animate-pulse"></div>
                      <div className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 w-10 h-10 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
                    </div>
                  </motion.div>
                </div>
              </Container>
            </div>
          </div>
        ))}
      </Slider>

      {/* Navigation Arrows */}
      <div
        className={`absolute inset-y-0 left-0 flex items-center z-20 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="ml-4 p-3 bg-gray-800/80 backdrop-blur-sm text-white hover:bg-gray-900 transition-all duration-200 rounded-full group shadow-lg"
          aria-label="Previous slide"
        >
          <HiChevronLeft className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>

      <div
        className={`absolute inset-y-0 right-0 flex items-center z-20 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="mr-4 p-3 bg-gray-800/80 backdrop-blur-sm text-white hover:bg-gray-900 transition-all duration-200 rounded-full group shadow-lg"
          aria-label="Next slide"
        >
          <HiChevronRight className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
