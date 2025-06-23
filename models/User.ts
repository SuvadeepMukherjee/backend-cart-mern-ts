import mongoose, { Schema, Document, Model } from "mongoose";

// Interface defining the structure of an object
//The IUser interface defines the structure of a user document in TypeScript.
//inherits all properties and methods from the Document interface.
interface IUser extends Document {
  userId: string; // Unique identifier for the user (stored as a string)
}

// Define the schema with TypeScript generics
// A generic in TypeScript allows us to create reusable, flexible, and type-safe components, functions, and classes
//  Schema<IUser> uses a generic type to enforce that this schema follows the IUser interface.
const UserSchema: Schema<IUser> = new Schema({
  userId: {
    type: String, // The user ID is stored as a string
    required: true, // The user ID is a required field
    unique: true, // Ensures that each user ID is unique in the database
  },
});

// Creating a Mongoose model for the "User" collection
// The Model<IUser> generic ensures the model follows the IUser interface structure
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
