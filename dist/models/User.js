import mongoose, { Schema } from "mongoose";
// Define the schema with TypeScript generics
// A generic in TypeScript allows us to create reusable, flexible, and type-safe components, functions, and classes
//  Schema<IUser> uses a generic type to enforce that this schema follows the IUser interface.
const UserSchema = new Schema({
    userId: {
        type: String, // The user ID is stored as a string
        required: true, // The user ID is a required field
        unique: true, // Ensures that each user ID is unique in the database
    },
});
// Creating a Mongoose model for the "User" collection
// The Model<IUser> generic ensures the model follows the IUser interface structure
const User = mongoose.model("User", UserSchema);
export default User;
