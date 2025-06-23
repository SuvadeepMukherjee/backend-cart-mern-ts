// Import Express framework and Router module
import express, { Router } from "express";

import {
  getCart,
  addToCart,
  removeFromCart,
  numberCart,
  totalAmount,
} from "../controllers/cartController.js";

// Creating an Express Router instance
//express.Router() modularize routes ,making the code more organized and reusable
const router: Router = express.Router();

router.get("/numberCart", numberCart);
router.get("/totalAmount", totalAmount);

router.post("/add", addToCart);
router.delete("/remove", removeFromCart);

router.get("/:userId", getCart);

export default router;
