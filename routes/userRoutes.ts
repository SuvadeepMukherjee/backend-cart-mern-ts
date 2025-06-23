// Import Express framework and Router module
import express, { Router } from "express";
import { getUser } from "../controllers/userController.js";

// Creating an Express Router instance
const router: Router = express.Router();

// Define a route to get user profile details based on userId parameter
//:userId is a dynamic paramrter acts as a placeholder for a specific userID
router.get("/profile/:userId", getUser);

export default router;
