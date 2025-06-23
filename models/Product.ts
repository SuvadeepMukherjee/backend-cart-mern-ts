import mongoose, { Schema, Document, Model } from "mongoose";

// Interface defining the structure of a product document
//The IProduct interface defines the structure of a product object in TypeScript.
//Extends Mongoose's Document interface to inherit built-in document properties and methods
interface IProduct extends Document {
  _id: number; // Unique identifier for the product
  productName: string; // Name of the product
  price: number; // Price of the product
  productImage: string; // path of the product image
  description: string; // Description of the product
  category: "laptop" | "mobile" | "tshirts" | "camera"; // Category must be one of these predefined values
}

// Define the schema with TypeScript generics
// A generic in TypeScript allows us to create reusable, flexible, and type-safe components, functions, and classes
// // Schema<IProduct> uses a generic type to enforce that this schema follows the IProduct interface.
const ProductSchema = new Schema<IProduct>({
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
const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);
export { IProduct };
export default Product;
