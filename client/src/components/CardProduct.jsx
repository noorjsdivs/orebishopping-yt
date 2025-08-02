import React from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { deleteItem } from "../redux/orebiSlice";
import AddToCartButton from "./AddToCartButton";
import PriceFormat from "./PriceFormat";
import PriceContainer from "./PriceContainer";
import toast from "react-hot-toast";

const CartProduct = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="flex col-span-5 md:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={() => {
            dispatch(deleteItem(item._id));
            toast.success(
              `${item?.name.substring(0, 10)}... is deleted successfully!`
            );
          }}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        <img className="w-32 h-32" src={item.image} alt="productImage" />
        <h1 className="font-titleFont font-semibold">{item.name}</h1>
      </div>
      <div className="col-span-5 md:col-span-3 flex items-center justify-between py-4 md:py-0 px-4 md:px-0 gap-6 md:gap-0">
        <div className="flex w-1/3 items-center text-lg font-semibold">
          <PriceContainer item={item} className="flex-col gap-0" />
        </div>
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <AddToCartButton item={item} className="border-red-500" />
        </div>

        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          <PriceFormat amount={item?.price * item?.quantity} />
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
