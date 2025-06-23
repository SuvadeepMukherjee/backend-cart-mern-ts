import mongoose, { Schema } from "mongoose";
// Define the Mongoose Schema for the Cart collection
// A generic in TypeScript allows us to create reusable, flexible, and type-safe components, functions, and classes
// // Schema<ICart> uses a generic type to enforce that this schema follows the ICart interface.
const CartSchema = new Schema({
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
const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
