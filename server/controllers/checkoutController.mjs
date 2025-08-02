import productModel from "../models/productModel.js";

// Process checkout and update stock
const processCheckout = async (req, res) => {
  try {
    const { items } = req.body; // Array of {productId, quantity}

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    const updatePromises = [];
    const stockCheckErrors = [];

    // First, check stock availability for all items
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        stockCheckErrors.push("Invalid product or quantity");
        continue;
      }

      const product = await productModel.findById(productId);

      if (!product) {
        stockCheckErrors.push(`Product not found: ${productId}`);
        continue;
      }

      if (product.stock < quantity) {
        stockCheckErrors.push(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
        );
        continue;
      }
    }

    if (stockCheckErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Stock validation failed",
        errors: stockCheckErrors,
      });
    }

    // If all checks pass, update stock for all items
    for (const item of items) {
      const { productId, quantity } = item;

      const updatePromise = productModel
        .findByIdAndUpdate(
          productId,
          {
            $inc: {
              stock: -quantity,
              soldQuantity: quantity,
            },
          },
          { new: true }
        )
        .then(async (product) => {
          // If stock becomes 0, mark as unavailable
          if (product.stock === 0) {
            await productModel.findByIdAndUpdate(productId, {
              isAvailable: false,
            });
          }
          return product;
        });

      updatePromises.push(updatePromise);
    }

    const updatedProducts = await Promise.all(updatePromises);

    res.json({
      success: true,
      message: "Checkout processed successfully",
      updatedProducts: updatedProducts.map((product) => ({
        _id: product._id,
        name: product.name,
        stock: product.stock,
        soldQuantity: product.soldQuantity,
        isAvailable: product.isAvailable,
      })),
    });
  } catch (error) {
    console.log("Checkout processing error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing checkout",
      error: error.message,
    });
  }
};

export { processCheckout };
