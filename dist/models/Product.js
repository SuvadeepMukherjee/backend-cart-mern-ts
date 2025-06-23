import mongoose, { Schema } from "mongoose";
// Define the schema with TypeScript generics
// A generic in TypeScript allows us to create reusable, flexible, and type-safe components, functions, and classes
// // Schema<IProduct> uses a generic type to enforce that this schema follows the IProduct interface.
const ProductSchema = new Schema({
    _id: { type: Number, required: true }, // Product ID is required and stored as a number
    productName: { type: String, required: true }, // Product name is required and stored as a string
    price: { type: Number, required: true }, // Product price is required and stored as a number
    productImage: { type: String, required: true }, // Product image  path is required
    description: { type: String, required: true }, // Product description is required
    category: {
        type: String,
        required: true,
        enum: ["laptop", "mobile", "tshirts", "camera"], //Restricts category to specific string values
    },
});
// Creating a Mongoose model for the "Product" collection with TypeScript type safety
// The Model<IProduct> generic ensures the model follows the IProduct interface structure
const Product = mongoose.model("Product", ProductSchema);
export default Product;
