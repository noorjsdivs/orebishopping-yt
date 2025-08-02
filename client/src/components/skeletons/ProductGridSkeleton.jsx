import ProductSkeleton from "./ProductSkeleton";

const ProductGridSkeleton = ({ title = "Loading...", count = 8 }) => {
  return (
    <div className="w-full py-10">
      <div className="flex items-center justify-between">
        <div className="text-2xl mb-3 font-bold">{title}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductGridSkeleton;
