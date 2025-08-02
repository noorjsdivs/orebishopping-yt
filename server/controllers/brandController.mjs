import brandModel from "../models/brandModel.js";
import { cloudinary, deleteCloudinaryImage } from "../config/cloudinary.js";
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

// Create brand
const createBrand = async (req, res) => {
  try {
    const { name, description, website } = req.body;

    // Check if brand already exists
    const existingBrand = await brandModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    let imageUrl = "";

    // Upload image to cloudinary if provided
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "orebi/brands",
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });
        imageUrl = uploadResult.secure_url;

        // Clean up temporary file
        cleanupTempFile(req.file.path);
      } catch (uploadError) {
        // Clean up temporary file on error
        if (req.file?.path) {
          cleanupTempFile(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Brand image is required",
      });
    }

    const newBrand = new brandModel({
      name,
      image: imageUrl,
      description: description || "",
      website: website || "",
    });

    await newBrand.save();

    res.json({
      success: true,
      message: "Brand created successfully",
      brand: newBrand,
    });
  } catch (error) {
    console.error("Create brand error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all brands
const getBrands = async (req, res) => {
  try {
    const brands = await brandModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      brands,
    });
  } catch (error) {
    console.error("Get brands error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single brand
const getBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await brandModel.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      brand,
    });
  } catch (error) {
    console.error("Get brand error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update brand
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, website, isActive } = req.body;

    const brand = await brandModel.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== brand.name) {
      const existingBrand = await brandModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: id },
      });

      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Brand name already exists",
        });
      }
    }

    let imageUrl = brand.image;

    // Upload new image if provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (brand.image) {
          const deleteResult = await deleteCloudinaryImage(brand.image);
          if (deleteResult.success) {
            console.log("Old brand image deleted from Cloudinary successfully");
          } else {
            console.log(
              "Failed to delete old brand image:",
              deleteResult.message
            );
          }
        }

        // Upload new image
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "orebi/brands",
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });
        imageUrl = uploadResult.secure_url;

        // Clean up temporary file
        cleanupTempFile(req.file.path);
      } catch (uploadError) {
        // Clean up temporary file on error
        if (req.file?.path) {
          cleanupTempFile(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    const updatedBrand = await brandModel.findByIdAndUpdate(
      id,
      {
        name: name || brand.name,
        image: imageUrl,
        description:
          description !== undefined ? description : brand.description,
        website: website !== undefined ? website : brand.website,
        isActive: isActive !== undefined ? isActive : brand.isActive,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (error) {
    console.error("Update brand error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete brand (soft delete)
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await brandModel.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    await brandModel.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Delete brand error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { createBrand, getBrands, getBrand, updateBrand, deleteBrand };
