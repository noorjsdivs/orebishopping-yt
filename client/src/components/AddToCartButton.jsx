import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../redux/orebiSlice";
import { FaMinus, FaPlus } from "react-icons/fa";
import { cn } from "./ui/cn";

const AddToCartButton = ({ item, className }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.orebiReducer);
  const [existingProduct, setExistingProduct] = useState(null);
  useEffect(() => {
    const availableItem = products.find(
      (product) => product?._id === item?._id
    );

    setExistingProduct(availableItem || null);
  }, [products, item]);

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    toast.success(`${item?.name.substring(0, 10)}... is added successfully!`);
  };

  return (
    <>
      {existingProduct ? (
        <div
          className={cn(
            "flex self-start items-center justify-center gap-3 py-2",
            className
          )}
        >
          <button
            disabled={existingProduct?.quantity <= 1}
            onClick={() => {
              dispatch(decreaseQuantity(item?._id));
              toast.success("Quantity decreased successfully!");
            }}
            className="border border-gray-300 text-gray-700 p-2 hover:border-black hover:text-black rounded-md text-sm transition-all duration-200 cursor-pointer disabled:text-gray-300 disabled:border-gray-200 disabled:hover:border-gray-200 disabled:hover:text-gray-300"
          >
            <FaMinus />
          </button>
          <p className="text-sm font-medium w-8 text-center">
            {existingProduct?.quantity || 0}
          </p>
          <button
            onClick={() => {
              dispatch(increaseQuantity(item?._id));
              toast.success("Quantity increased successfully!");
            }}
            className="border border-gray-300 text-gray-700 p-2 hover:border-black hover:text-black rounded-md text-sm transition-all duration-200 cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full border border-black text-black text-xs font-medium py-3 px-6 uppercase tracking-wide hover:bg-black hover:text-white transition-all duration-200"
        >
          Add to cart
        </button>
      )}
    </>
  );
};

AddToCartButton.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default AddToCartButton;
