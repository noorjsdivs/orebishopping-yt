import { v2 as cloudinary } from "cloudinary";
import { deleteCloudinaryImage } from "../config/cloudinary.js";
import productModel from "../models/productModel.js";
import fs from "fs";

// Helper function to clean up temporary files
const cleanupTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Temporary file cleaned up:", filePath);
    }
  } catch (error) {
    console.error("Error cleaning up temporary file:", error);
  }
};

// Add product
const addProduct = async (req, res) => {
  try {
    const {
      _type,
      name,
      price,
      discountedPercentage,
      stock,
      category,
      brand,
      badge,
      isAvailable,
      offer,
      description,
      tags,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Check for required fields
    if (!name || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, price, category, and description are mandatory.",
      });
    }

    // Collect only the images that exist
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          let result = await cloudinary.uploader.upload(item.path, {
            folder: "orebi/products",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "fill" },
              { quality: "auto", fetch_format: "auto" },
            ],
          });

          // Clean up temporary file after successful upload
          cleanupTempFile(item.path);

          return result.secure_url;
        } catch (error) {
          // Clean up temporary file even on error
          cleanupTempFile(item.path);
          throw error;
        }
      })
    );

    // Parse tags or split if necessary
    let parsedTags;
    try {
      parsedTags = JSON.parse(tags);
    } catch (err) {
      parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
    }

    const productData = {
      _type: _type ? _type : "",
      name,
      price: Number(price),
      discountedPercentage: discountedPercentage
        ? Number(discountedPercentage)
        : 10,
      stock: stock ? Number(stock) : 0,
      soldQuantity: 0,
      category,
      brand: brand ? brand : "",
      badge: badge === "true" ? true : false,
      isAvailable: isAvailable === "true" ? true : false,
      offer: offer === "true" ? true : false,
      description,
      tags: tags ? parsedTags : [],
      images: imagesUrl,
    };

    const product = new productModel(productData);
    product.save();

    res.json({
      success: true,
      message: `${name} added and save to DB successfully`,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List products with filtering
const listProducts = async (req, res) => {
  try {
    const {
      _type,
      _id,
      _search,
      brand,
      category,
      offer,
      onSale,
      isAvailable,
      _page = 1,
      _perPage = 25,
    } = req.query;

    // Filter by specific ID
    if (_id) {
      const dbProduct = await productModel.findById(_id);
      if (dbProduct) {
        // Format product for frontend compatibility
        const formattedProduct = {
          ...dbProduct.toObject(),
          image:
            dbProduct.images && dbProduct.images.length > 0
              ? dbProduct.images[0]
              : "",
        };
        return res.json({ success: true, product: formattedProduct });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }
    }

    // Build filter object for database query
    let filter = {};

    // Filter by availability (only show available products by default)
    if (isAvailable !== "false") {
      filter.isAvailable = true;
    }

    // Filter by type
    if (_type) {
      filter._type = _type;
    }

    // Filter by brand
    if (brand) {
      filter.brand = brand;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by offer
    if (offer === "true") {
      filter.offer = true;
    }

    // Filter by onSale
    if (onSale === "true") {
      filter.onSale = true;
    }

    // Search by name or description
    if (_search) {
      const searchRegex = new RegExp(_search, "i");
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Get database products
    let dbProducts = await productModel.find(filter).sort({ createdAt: -1 });

    // Format database products for frontend compatibility
    let formattedDbProducts = dbProducts.map((product) => ({
      ...product.toObject(),
      image:
        product.images && product.images.length > 0 ? product.images[0] : "",
    }));

    // Apply pagination
    const page = parseInt(_page, 10) || 1;
    const perPage = parseInt(_perPage, 10) || 25;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const paginatedProducts = formattedDbProducts.slice(startIndex, endIndex);

    // Return response based on whether pagination is requested
    if (_page || _perPage) {
      res.json({
        success: true,
        products: paginatedProducts,
        currentPage: page,
        perPage,
        totalItems: formattedDbProducts.length,
        totalPages: Math.ceil(formattedDbProducts.length / perPage),
      });
    } else {
      res.json({
        success: true,
        products: formattedDbProducts,
        total: formattedDbProducts.length,
      });
    }
  } catch (error) {
    console.log("List products error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product
const removeProduct = async (req, res) => {
  try {
    // First, find the product to get its images
    const product = await productModel.findById(req.body._id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Delete all product images from Cloudinary
    if (product.images && Array.isArray(product.images)) {
      for (const imageUrl of product.images) {
        try {
          const deleteResult = await deleteCloudinaryImage(imageUrl);
          if (deleteResult.success) {
            console.log("Product image deleted from Cloudinary successfully");
          } else {
            console.log(
              "Failed to delete product image:",
              deleteResult.message
            );
          }
        } catch (error) {
          console.log("Error deleting product image from Cloudinary:", error);
          // Continue with deletion even if some images fail
        }
      }
    }

    // Delete the product from database
    await productModel.findByIdAndDelete(req.body._id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Single product
const singleProducts = async (req, res) => {
  try {
    const productId = req.body._id || req.query._id || req.params.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only return available products for non-admin requests
    if (!product.isAvailable && !req.user?.role === "admin") {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.log("Single product error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Update stock after purchase
const updateStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product ID and valid quantity are required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    // Update stock and sold quantity
    product.stock -= quantity;
    product.soldQuantity += quantity;

    // If stock is 0, mark as unavailable
    if (product.stock === 0) {
      product.isAvailable = false;
    }

    await product.save();

    res.json({
      success: true,
      message: "Stock updated successfully",
      product: {
        _id: product._id,
        stock: product.stock,
        soldQuantity: product.soldQuantity,
        isAvailable: product.isAvailable,
      },
    });
  } catch (error) {
    console.log("Update stock error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      _type,
      name,
      price,
      discountedPercentage,
      stock,
      category,
      brand,
      badge,
      isAvailable,
      offer,
      description,
      tags,
    } = req.body;

    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    // Find the existing product
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check for required fields
    if (!name || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, price, category, and description are mandatory.",
      });
    }

    let imagesUrl = existingProduct.images; // Keep existing images by default

    // If new images are uploaded, upload them to cloudinary
    const newImages = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    if (newImages.length > 0) {
      try {
        const uploadPromises = newImages.map(async (item, index) => {
          const result = await cloudinary.uploader.upload(item.path, {
            folder: "orebi/products",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "fill" },
              { quality: "auto", fetch_format: "auto" },
            ],
          });

          // Clean up temporary file after successful upload
          cleanupTempFile(item.path);

          return { index, url: result.secure_url };
        });

        const uploadResults = await Promise.all(uploadPromises);

        // Update only the new image positions
        uploadResults.forEach(({ index, url }) => {
          if (index < imagesUrl.length) {
            imagesUrl[index] = url;
          } else {
            imagesUrl.push(url);
          }
        });
      } catch (error) {
        console.error("Error uploading images:", error);
        // Clean up temp files on error
        newImages.forEach((item) => cleanupTempFile(item.path));
        return res.status(500).json({
          success: false,
          message: "Error uploading images",
        });
      }
    }

    // Parse tags
    let parsedTags;
    try {
      parsedTags = JSON.parse(tags);
    } catch (err) {
      parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
    }

    const updateData = {
      _type: _type || "",
      name,
      price: Number(price),
      discountedPercentage: discountedPercentage
        ? Number(discountedPercentage)
        : 10,
      stock: stock ? Number(stock) : 0,
      category,
      brand: brand || "",
      badge: badge === "true" ? true : false,
      isAvailable: isAvailable === "true" ? true : false,
      offer: offer === "true" ? true : false,
      description,
      tags: parsedTags,
      images: imagesUrl,
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: `${name} updated successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    console.log("Update product error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  singleProducts,
  updateStock,
  updateProduct,
};
