// import mongoose from "mongoose";
// import Product from "./models/Product.js";
// import "dotenv/config";

// const MONGO_URI = process.env.MONGO_URI;

// mongoose.connect(
//   MONGO_URI as string, // Type assertion to ensure it's treated as a string
//   {
//     useNewUrlParser: true, // Ensures MongoDB connection uses the new URL parser
//     useUnifiedTopology: true, // Enables the new Server Discovery and Monitoring engine
//   } as mongoose.ConnectOptions // Type assertion for Mongoose connection options
// );

// // Array of product objects to be inserted into the database
// const products = [
//   {
//     _id: 1,
//     productName: "IPhone",
//     price: 999.0,
//     productImage: "http://localhost:5000/images/1.png",
//     description: "High-end smartphone",
//     category: "mobile",
//   },
//   {
//     _id: 2,
//     productName: "Macbook Pro 2022 (M1)",
//     price: 1999.0,
//     productImage: "http://localhost:5000/images/2.png",
//     description: "Latest Apple laptop",
//     category: "laptop",
//   },
//   {
//     _id: 3,
//     productName: "Cannon M50 Camera",
//     price: 699.0,
//     productImage: "http://localhost:5000/images/3.png",
//     description: "Compact DSLR camera",
//     category: "camera",
//   },
//   {
//     _id: 4,
//     productName: "WLS Van Gogh Denim Jacket",
//     price: 228.0,
//     productImage: "http://localhost:5000/images/4.png",
//     description: "Trendy denim jacket",
//     category: "tshirts",
//   },
// ];

// // Function to insert the products into the database
// const insertProducts = async () => {
//   try {
//     await Product.insertMany(products);
//     console.log("Products added successfully!");
//   } catch (err) {
//     console.error("Error inserting products:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// insertProducts();

import mongoose from "mongoose";
import Product from "./models/Product.js";
import "dotenv/config";

// Load the MongoDB connection string from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Ensure MONGO_URI is defined before connecting
if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI in environment variables");
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

// Hosted base URL for image resources
const IMAGE_BASE_URL = "https://backend-cart-mern-ts.onrender.com/images";

// Array of product objects to be inserted into the database
const products = [
  {
    _id: 1,
    productName: "IPhone",
    price: 999.0,
    productImage: `${IMAGE_BASE_URL}/1.png`,
    description: "High-end smartphone",
    category: "mobile",
  },
  {
    _id: 2,
    productName: "Macbook Pro 2022 (M1)",
    price: 1999.0,
    productImage: `${IMAGE_BASE_URL}/2.png`,
    description: "Latest Apple laptop",
    category: "laptop",
  },
  {
    _id: 3,
    productName: "Cannon M50 Camera",
    price: 699.0,
    productImage: `${IMAGE_BASE_URL}/3.png`,
    description: "Compact DSLR camera",
    category: "camera",
  },
  {
    _id: 4,
    productName: "WLS Van Gogh Denim Jacket",
    price: 228.0,
    productImage: `${IMAGE_BASE_URL}/4.png`,
    description: "Trendy denim jacket",
    category: "tshirts",
  },
];

// Insert products into the database
const insertProducts = async () => {
  try {
    await Product.insertMany(products);
    console.log("✅ Products added successfully!");
  } catch (error) {
    console.error("❌ Error inserting products:", error);
  } finally {
    await mongoose.connection.close();
  }
};

// Execute the insertion
insertProducts();

