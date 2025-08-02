import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
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

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Route for user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    if (!user.isActive) {
      return res.json({ success: false, message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = createToken(user);
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "User logged in successfully",
      });
    } else {
      res.json({ success: false, message: "Invalid credentials, try again" });
    }
  } catch (error) {
    console.log("User Login Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const userRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
      address,
      isActive = true,
    } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password length should be equal or greater than 8",
      });
    }

    // Only allow admin role creation if the request comes from an admin
    if (role === "admin" && (!req.user || req.user.role !== "admin")) {
      return res.json({
        success: false,
        message: "Only admins can create admin accounts",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role,
      isActive: isActive,
      address: address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
      },
    });

    const user = await newUser.save();

    const token = createToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User registered successfully!",
    });
  } catch (error) {
    console.log("User Register Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login (now uses role-based authentication)
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    if (user.role !== "admin") {
      return res.json({ success: false, message: "Admin access required" });
    }

    if (!user.isActive) {
      return res.json({ success: false, message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = createToken(user);
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "Welcome admin",
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Admin Login Error", error);
    res.json({ success: false, message: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    // First, find the user to get their avatar URL
    const user = await userModel.findById(req.body._id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Delete user's avatar from Cloudinary if exists
    if (user.avatar) {
      try {
        const deleteResult = await deleteCloudinaryImage(user.avatar);
        if (deleteResult.success) {
          console.log("User avatar deleted from Cloudinary successfully");
        } else {
          console.log(
            "Failed to delete user avatar from Cloudinary:",
            deleteResult.message
          );
        }
      } catch (error) {
        console.log("Error deleting user avatar from Cloudinary:", error);
        // Continue with user deletion even if avatar deletion fails
      }
    }

    // Delete the user from database
    await userModel.findByIdAndDelete(req.body._id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log("Removed user Error", error);
    res.json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { _id, name, email, password, role, avatar, addresses, isActive } =
      req.body;

    const user = await userModel.findById(_id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Please enter a valid email address",
        });
      }
      user.email = email;
    }

    if (role) {
      // Only allow admin role updates if the requesting user is admin
      if (role === "admin" && (!req.user || req.user.role !== "admin")) {
        return res.json({
          success: false,
          message: "Only admins can assign admin role",
        });
      }
      user.role = role;
    }

    // Handle avatar update
    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    // Handle new addresses array
    if (addresses) {
      user.addresses = addresses;
    }

    // Handle isActive field - only admins can change account status
    if (isActive !== undefined && req.user && req.user.role === "admin") {
      user.isActive = isActive;
    }

    if (password) {
      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Password length should be equal or greater than 8",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.log("Update user Error", error);
    res.json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (role) {
      filter.role = role;
    }

    const total = await userModel.countDocuments(filter);
    const users = await userModel
      .find(filter)
      .select("-password") // Exclude password from response
      .populate("orders")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Address Management Functions

// Add new address for user
const addAddress = async (req, res) => {
  try {
    const userId = req.user?.id; // Get from auth middleware for user routes
    const paramUserId = req.params?.userId; // Get from params for admin routes
    const targetUserId = userId || paramUserId;

    const { label, street, city, state, zipCode, country, phone, isDefault } =
      req.body;

    // Validate required fields
    if (!label || !street || !city || !state || !zipCode || !country) {
      return res.json({
        success: false,
        message:
          "All address fields are required (label, street, city, state, zipCode, country)",
      });
    }

    const user = await userModel.findById(targetUserId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // If this is being set as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // If this is the first address, make it default
    const newAddress = {
      label,
      street,
      city,
      state,
      zipCode,
      country,
      phone: phone || "",
      isDefault: isDefault || user.addresses.length === 0,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.log("Add Address Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Update existing address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user?.id; // Get from auth middleware for user routes
    const paramUserId = req.params?.userId; // Get from params for admin routes
    const targetUserId = userId || paramUserId;
    const { addressId } = req.params;
    const { label, street, city, state, zipCode, country, phone, isDefault } =
      req.body;

    const user = await userModel.findById(targetUserId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.json({ success: false, message: "Address not found" });
    }

    // If setting as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // Update the address
    const updatedAddress = {
      ...user.addresses[addressIndex].toObject(),
      label: label || user.addresses[addressIndex].label,
      street: street || user.addresses[addressIndex].street,
      city: city || user.addresses[addressIndex].city,
      state: state || user.addresses[addressIndex].state,
      zipCode: zipCode || user.addresses[addressIndex].zipCode,
      country: country || user.addresses[addressIndex].country,
      phone: phone !== undefined ? phone : user.addresses[addressIndex].phone,
      isDefault:
        isDefault !== undefined
          ? isDefault
          : user.addresses[addressIndex].isDefault,
    };

    user.addresses[addressIndex] = updatedAddress;
    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.log("Update Address Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user?.id; // Get from auth middleware for user routes
    const paramUserId = req.params?.userId; // Get from params for admin routes
    const targetUserId = userId || paramUserId;
    const { addressId } = req.params;

    const user = await userModel.findById(targetUserId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.json({ success: false, message: "Address not found" });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default and there are remaining addresses, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log("Delete Address Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Set default address
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user?.id; // Get from auth middleware for user routes
    const paramUserId = req.params?.userId; // Get from params for admin routes
    const targetUserId = userId || paramUserId;
    const { addressId } = req.params;

    const user = await userModel.findById(targetUserId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.json({ success: false, message: "Address not found" });
    }

    // Remove default from all addresses and set the specified one as default
    user.addresses.forEach((addr) => (addr.isDefault = false));
    user.addresses[addressIndex].isDefault = true;

    await user.save();

    res.json({
      success: true,
      message: "Default address updated successfully",
    });
  } catch (error) {
    console.log("Set Default Address Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Get user addresses
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user?.id; // Get from auth middleware for user routes
    const paramUserId = req.params?.userId; // Get from params for admin routes
    const targetUserId = userId || paramUserId;

    const user = await userModel.findById(targetUserId).select("addresses");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.log("Get Addresses Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Avatar upload function
const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    // Upload image to Cloudinary in the orebi/users folder
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "orebi/users",
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    // Clean up temporary file
    cleanupTempFile(req.file.path);

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatarUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.log("Avatar upload error", error);

    // Clean up temporary file even on error
    if (req.file?.path) {
      cleanupTempFile(req.file.path);
    }

    res.json({ success: false, message: error.message });
  }
};

export {
  userLogin,
  userRegister,
  adminLogin,
  getUsers,
  removeUser,
  updateUser,
  getUserProfile,
  updateUserProfile,
  addToCart,
  updateCart,
  getUserCart,
  clearCart,
  createAdmin,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserAddresses,
  uploadUserAvatar,
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password")
      .populate("orders");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.addresses && user.addresses[0] ? user.addresses[0].phone : "",
      address:
        user.addresses && user.addresses[0] ? user.addresses[0].street : "",
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive,
      orders: user.orders,
      addresses: user.addresses,
    };

    res.json({ success: true, user: userProfile });
  } catch (error) {
    console.log("Get Profile Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Please enter a valid email address",
        });
      }

      // Check if email is already taken by another user
      const existingUser = await userModel.findOne({
        email: email,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res.json({
          success: false,
          message: "Email is already taken by another user",
        });
      }

      user.email = email;
    }

    // Handle phone and address - update the first address or create one
    if (phone || address) {
      if (!user.addresses || user.addresses.length === 0) {
        // Create a default address entry
        user.addresses = [
          {
            label: "Primary",
            street: address || "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            phone: phone || "",
            isDefault: true,
          },
        ];
      } else {
        // Update the first (primary) address
        if (phone) user.addresses[0].phone = phone;
        if (address) user.addresses[0].street = address;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone:
          user.addresses && user.addresses[0] ? user.addresses[0].phone : "",
        address:
          user.addresses && user.addresses[0] ? user.addresses[0].street : "",
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Update Profile Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartKey = size ? `${productId}_${size}` : productId;

    if (user.userCart[cartKey]) {
      user.userCart[cartKey] += quantity;
    } else {
      user.userCart[cartKey] = quantity;
    }

    await user.save();

    res.json({
      success: true,
      message: "Item added to cart",
      cart: user.userCart,
    });
  } catch (error) {
    console.log("Add to Cart Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Update cart item
const updateCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartKey = size ? `${productId}_${size}` : productId;

    if (quantity <= 0) {
      delete user.userCart[cartKey];
    } else {
      user.userCart[cartKey] = quantity;
    }

    await user.save();

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart: user.userCart,
    });
  } catch (error) {
    console.log("Update Cart Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      cart: user.userCart || {},
    });
  } catch (error) {
    console.log("Get Cart Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Clear user cart
const clearCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.userCart = {};
    await user.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.log("Clear Cart Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Create admin user (only accessible by existing admins)
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if requesting user is admin
    if (req.user.role !== "admin") {
      return res.json({ success: false, message: "Admin access required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password length should be equal or greater than 8",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    const admin = await newAdmin.save();

    res.json({
      success: true,
      message: "Admin created successfully!",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log("Create Admin Error", error);
    res.json({ success: false, message: error.message });
  }
};
