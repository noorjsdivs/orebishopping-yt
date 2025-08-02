import Container from "./Container";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { logo } from "../assets/images";
import { HiOutlineMenu } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import SearchInput from "./SearchInput";
import Title from "./ui/title";
import SocialLinks from "./SocialLinks";
import { IoMdCart } from "react-icons/io";
import { useSelector } from "react-redux";
import { FaUserAlt } from "react-icons/fa";
export const headerNavigation = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Shop",
    link: "/shop",
  },
  {
    title: "About",
    link: "/about",
  },
  {
    title: "Contact",
    link: "/contact",
  },
  // {
  //   title: "Blog",
  //   link: "/blog",
  // },
  // {
  //   title: "FAQ",
  //   link: "/faq",
  // },
  {
    title: "Orders",
    link: "/orders",
  },
];

const Header = () => {
  const location = useLocation();
  const { products, userInfo, orderCount } = useSelector(
    (state) => state.orebiReducer
  );
  let [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      {" "}
      <Container className="py-4 lg:py-6 flex items-center gap-x-3 md:gap-x-7 justify-between">
        <Link to={"/"} className="flex-shrink-0">
          <img src={logo} alt="logo" className="h-5 w-auto" />
        </Link>

        <SearchInput />

        <div className="hidden md:inline-flex items-center gap-4 lg:gap-x-6 text-sm uppercase font-medium text-gray-700">
          {headerNavigation.map((item) => (
            <NavLink
              key={item?.title}
              className={`hover:text-black duration-300 relative group overflow-hidden px-1 py-2 transition-colors ${
                location?.pathname === item?.link
                  ? "text-black font-semibold"
                  : "text-gray-700"
              }`}
              to={item?.link}
              state={{ data: location.pathname.split("/")[1] }}
            >
              <div className="relative flex items-center">
                {item?.title}
                {item?.title === "Orders" && userInfo && orderCount > 0 && (
                  <span className="absolute -right-1 -top-2 w-4 h-4 rounded-full text-xs bg-red-500 text-white flex items-center justify-center font-medium animate-pulse">
                    {orderCount}
                  </span>
                )}
              </div>
              <span
                className={`absolute bottom-0 left-0 inline-block w-full h-0.5 bg-black group-hover:translate-x-0 duration-300 ease-out ${
                  location?.pathname === item?.link
                    ? "translate-x-0"
                    : "-translate-x-full"
                }`}
              />
            </NavLink>
          ))}

          <Link
            to={"/cart"}
            className="text-2xl text-gray-700 hover:text-black relative transition-colors duration-300 p-2"
          >
            <IoMdCart />
            {products?.length > 0 && (
              <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full text-xs bg-black text-white flex items-center justify-center font-medium animate-pulse">
                {products.length}
              </span>
            )}
          </Link>

          {userInfo ? (
            <Link
              to={"/profile"}
              className="text-sm text-gray-700 hover:text-black font-medium transition-colors duration-300 px-2 py-1 rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUserAlt className="text-xs text-gray-600" />
                </div>
                <span className="hidden lg:inline">{userInfo?.name}</span>
              </div>
            </Link>
          ) : (
            <Link
              to={"/signin"}
              className="text-xl text-gray-700 hover:text-black relative transition-colors duration-300 p-2"
            >
              <FaUserAlt />
            </Link>
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="text-2xl text-gray-700 hover:text-black duration-300 md:hidden p-2 hover:bg-gray-50 rounded-md transition-all"
        >
          <HiOutlineMenu />
        </button>

        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50 md:hidden"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
          <div className="fixed inset-0 flex items-start justify-center pt-16 px-4">
            <DialogPanel className="w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Title className="text-xl font-bold text-gray-900">
                    Menu
                  </Title>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full"
                  >
                    <IoCloseOutline className="text-2xl" />
                  </button>
                </div>

                <div className="space-y-1">
                  {headerNavigation?.map((item) => (
                    <NavLink
                      key={item?.title}
                      to={item?.link}
                      onClick={() => setIsOpen(false)}
                      state={{ data: location.pathname.split("/")[1] }}
                      className={`block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 transform hover:translate-x-1 ${
                        location?.pathname === item?.link
                          ? "bg-gray-100 text-black font-semibold"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                              location?.pathname === item?.link
                                ? "bg-black"
                                : "bg-gray-300"
                            }`}
                          />
                          {item?.title}
                        </div>
                        {item?.title === "Orders" &&
                          userInfo &&
                          orderCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {orderCount}
                            </span>
                          )}
                      </div>
                    </NavLink>
                  ))}

                  <Link
                    to={"/cart"}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 transform hover:translate-x-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <span>Cart</span>
                      {products?.length > 0 && (
                        <span className="ml-auto bg-black text-white text-xs px-2 py-1 rounded-full">
                          {products.length}
                        </span>
                      )}
                    </div>
                  </Link>

                  {userInfo ? (
                    <Link
                      to={"/profile"}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 transform hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <span>Profile ({userInfo?.name})</span>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      to={"/signin"}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 transform hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        Sign In
                      </div>
                    </Link>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <SocialLinks />
                </div>
              </div>
            </DialogPanel>{" "}
          </div>
        </Dialog>
      </Container>
    </div>
  );
};

export default Header;
