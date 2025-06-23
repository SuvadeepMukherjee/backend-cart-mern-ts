import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

// Function to establish a connection to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI as string, // Connect to MongoDB using the URI from environment variables
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions // Cast options to the correct Mongoose type
    );
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process with failure code (1)
  }
};

// Function to seed dummy users into the database
const seedUsers = async (): Promise<void> => {
  try {
    // Define an array of dummy user IDs
    const userIds: string[] = [
      "65c96f8a1a2b4c001f3d8e9a", // Existing user
      "a24b23c5d3f4g78h90i1j2k3",
      "b34f23e4d5g6h89i12j3k4l5",
      "c45g67h8j9k0l1m2n3o4p5q6",
      "d56h78j9k0l2m3n4o5p6q7r8",
      "e67i89j0k1l2m3n4o5p6q7s9",
    ];

    // Loop through each user ID in the array
    for (const userId of userIds) {
      const existingUser = await User.findOne({ userId }).exec(); // Check if the user already exists in the database

      if (existingUser) {
        console.log(`User with ID ${userId} already exists!`);
      } else {
        const newUser = new User({ userId ,email: `${userId}@example.com`}); // Create a new user with the given userId
        await newUser.save(); // Save the new user to the database
        console.log(`Dummy user with ID ${userId} added to the database.`);
      }
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.connection.close(); // Close the database connection after seeding users
  }
};

const run = async (): Promise<void> => {
  await connectDB();
  await seedUsers();
};

run();
