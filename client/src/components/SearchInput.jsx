import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { getData } from "../helpers";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts([]);
      return;
    }

    const endpoint = `http://localhost:8000/api/products?_search=${search}`;

    try {
      setLoading(true);
      const getProducts = async () => {
        const data = await getData(endpoint);
        // Handle the new API response format that includes success field
        setFilteredProducts(data?.products || []);
      };
      getProducts();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsInputFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="flex-1 h-12 relative max-w-2xl">
      <div className="relative h-full">
        <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          onFocus={() => setIsInputFocused(true)}
          className="w-full h-full border border-gray-200 rounded-full outline-none pl-12 pr-12 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 bg-gray-50 focus:bg-white"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        )}
      </div>

      {isInputFocused && search && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            </div>
          ) : (
            <>
              {filteredProducts?.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm text-gray-600 font-medium">
                      {filteredProducts.length} product
                      {filteredProducts.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  {filteredProducts?.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSearch("");
                        setIsInputFocused(false);
                        navigate(`/product/${item?._id}`, {
                          state: {
                            item: item,
                          },
                        });
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item?.images?.[0] || item?.image ? (
                          <img
                            src={item?.images?.[0] || item?.image}
                            alt={item?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CiSearch className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item?.name}
                        </h4>
                        {item?.price && (
                          <p className="text-sm text-gray-600">${item.price}</p>
                        )}
                      </div>
                      <CiSearch className="text-gray-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CiSearch className="text-2xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600">
                    No products match{" "}
                    <span className="font-semibold text-gray-900">
                      &ldquo;{search}&rdquo;
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
