import mongoose from "mongoose";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";
import orderModel from "./models/orderModel.js";
import "dotenv/config";

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to database");

    // Check products
    const products = await productModel.find({});
    console.log(`\n📦 Products in database: ${products.length}`);

    if (products.length > 0) {
      console.log("\nExisting products:");
      products.slice(0, 10).forEach((p, index) => {
        console.log(
          `${index + 1}. ${p.name} - $${p.price} (Category: ${
            p.category
          }) - Type: ${p._type || "N/A"}`
        );
      });
      if (products.length > 10) {
        console.log(`... and ${products.length - 10} more products`);
      }
    } else {
      console.log("No products found in database");
    }

    // Check users
    const users = await userModel.find({});
    console.log(`\n👥 Users in database: ${users.length}`);
    const adminUsers = users.filter((u) => u.role === "admin");
    const regularUsers = users.filter((u) => u.role === "user");
    console.log(`   - Admin users: ${adminUsers.length}`);
    console.log(`   - Regular users: ${regularUsers.length}`);

    // Check orders
    const orders = await orderModel.find({});
    console.log(`\n🛍️  Orders in database: ${orders.length}`);

    console.log("\n🎯 Database check completed!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkDatabase();
