import mongoose, { Schema, Document, Model } from "mongoose";
import { IProduct } from "./Product.js"; //// Importing the IProduct interface from the Product model

// Interface defining the structure of an object
//The ICart interface defines the structure of a ICartIten object in TypeScript.
interface ICartItem {
  product: string | IProduct; // Can be either a product ID (string) or a full product object
  quantity: number; // The quantity of the product in the cart
}

// Interface defining the structure of an object
//The ICart interface defines the structure of a cart object in TypeScript.
//inherits all properties and methods from the Document interface.
// The Schema<ICart> generic enforces type safety, ensuring the schema adheres to the ICart interface
export interface ICart extends Document {
  userId: string; // ID of the user who owns the cart
  items: ICartItem[]; // Array of cart items
}

// Define the Mongoose Schema for the Cart collection
// A generic in TypeScript allows us to create reusable, flexible, and type-safe components, functions, and classes
// // Schema<ICart> uses a generic type to enforce that this schema follows the ICart interface.
const CartSchema: Schema<ICart> = new Schema({
  userId: { type: String, required: true }, // User ID is required and stored as a string
  items: [
    {
      product: { type: String, ref: "Product" }, // Reference to the Product model (stored as a string ID)
      quantity: { type: Number, required: true }, // Quantity of the product in the cart (required field)
    },
  ],
});

// Creating a Mongoose model for the "Cart" collection with TypeScript type safety
// The Model<ICart> generic ensures the model follows the ICart interface structure
const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
