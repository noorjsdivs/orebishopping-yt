import React from "react";
import AddToCartButton from "../AddToCartButton";
import { MdStar } from "react-icons/md";
import PriceContainer from "../PriceContainer";

const ProductInfo = ({ productInfo }) => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.name}</h2>
      <PriceContainer item={productInfo} />
      <div className="flex items-center gap-1">
        <div className="text-base text-lightText flex items-center">
          {Array?.from({ length: 5 })?.map((_, index) => {
            const filled = index + 1 <= Math.floor(productInfo?.ratings);
            const halfFilled =
              index + 1 > Math.floor(productInfo?.ratings) &&
              index < Math.ceil(productInfo?.ratings);

            return (
              <MdStar
                key={index}
                className={`${
                  filled
                    ? "text-yellow-500"
                    : halfFilled
                    ? "text-yellow-300"
                    : "text-gray-400"
                }`}
              />
            );
          })}
        </div>
        <p className="text-base font-semibold">{`(${productInfo?.ratings?.toFixed(
          1
        )} reviews)`}</p>
      </div>
      <p className="text-base text-gray-600">{productInfo.description}</p>
      <p className="text-sm">Be the first to leave a review.</p>

      <AddToCartButton item={productInfo} />

      <p className="font-normal text-sm">
        <span className="text-base font-normal"> Categories:</span>{" "}
        <span className="text-lg font-semibold capitalize">
          {productInfo.category}
        </span>
      </p>
    </div>
  );
};

export default ProductInfo;
