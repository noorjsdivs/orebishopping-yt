import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import ProductCard from "../ProductCard";

const PaginationProductList = ({
  products = [],
  currentPage = 1,
  itemsPerPage = 12,
  onPageChange,
  viewMode = "grid",
}) => {
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedProducts(products.slice(startIndex, endIndex));
  }, [products, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (products.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-6 text-gray-300">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 max-w-md">
            We couldn&apos;t find any products matching your criteria. Try
            adjusting your filters or search terms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "grid grid-cols-1 gap-4"
        }
      >
        {paginatedProducts.map((product) => (
          <div
            key={product._id}
            className={
              viewMode === "list"
                ? "transform-none" // Override any transforms for list view
                : ""
            }
          >
            <ProductCard item={product} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
            totalItems={products.length}
          />
        </div>
      )}
    </div>
  );
};
PaginationProductList.propTypes = {
  products: PropTypes.array.isRequired,
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  viewMode: PropTypes.string,
};

export default PaginationProductList;
