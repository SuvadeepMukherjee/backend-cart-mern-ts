// Load environment variables from a .env file
import "dotenv/config";
// Import Express framework
import express from "express";
// Import CORS middleware for handling cross-origin requests
import cors from "cors";
// Import path module for working with file paths
import path from "path";
// Import function to connect to the database
import connectDB from "./config/db.js";
// Import routers
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
const port = 5000;
const app = express();
//enable cors to allow cross-origin requests
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
// Serve static files (like images) from the "public/images" directory
// When accessed via "/images", it maps to "public/images"
app.use("/images", express.static(path.join(process.cwd(), "public/images")));
// Set up API routes for different functionalities
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
// Start the server and listen on the defined port only if not in test mode
if (process.env.NODE_ENV !== "test") {
    connectDB(); //Establish connection to the database
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
export default app;
