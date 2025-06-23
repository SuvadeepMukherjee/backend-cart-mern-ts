import mongoose from "mongoose";
//Imports environment variables from a .env file
import "dotenv/config";

//returns a Promise with no resolved value (void)
const connectDB = async (): Promise<void> => {
  try {
    // as string tells TypeScript to treat it as a string (type assertion)
    await mongoose.connect(process.env.MONGO_URI as string);
    //console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    //forcefully terminates the Node.js process with an exit code of 1,
    // indicating that the process encountered an error or failure.
    process.exit(1);
  }
};

export default connectDB;
