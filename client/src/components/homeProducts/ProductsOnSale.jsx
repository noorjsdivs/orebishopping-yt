import { useState, useEffect } from "react";
import PriceFormat from "../PriceFormat";
import { useNavigate } from "react-router-dom";
import { getData } from "../../helpers";

const ProductsOnSale = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOnSaleProducts = async () => {
      try {
        // Fetch products that are on sale from the database
        const response = await getData("/api/products");
        if (response?.success) {
          // Filter products that are on sale
          const onSaleProducts = response.data.filter(
            (item) => item?.onSale || item?.offer
          );
          setProducts(onSaleProducts.slice(0, 6)); // Limit to 6 products
        }
      } catch (error) {
        console.error("Error fetching on sale products:", error);
      }
    };

    fetchOnSaleProducts();
  }, []);

  if (products.length === 0) {
    return (
      <div>
        <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
          Products on sale
        </h3>
        <p className="text-gray-500">No products on sale at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Products on sale
      </h3>
      <div className="flex flex-col gap-2">
        {products.map((item) => (
          <div
            onClick={() =>
              navigate(`/product/${item?._id}`, {
                state: {
                  item: item,
                },
              })
            }
            key={item._id}
            className="flex items-center gap-2 border-[1px] border-primary/20 py-2 rounded-md hover:border-primary/80 cursor-pointer duration-300"
          >
            <img
              className="w-20 object-contain"
              src={item.img || item.image}
              alt={"productImage"}
            />

            <div className="flex flex-col gap-2 font-titleFont px-1">
              <p className="text-sm font-medium">{item.name}</p>
              <PriceFormat amount={item?.price} className="text-sm font-bold" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsOnSale;
