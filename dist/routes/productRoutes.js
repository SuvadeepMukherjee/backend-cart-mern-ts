// Import Express framework and Router module
import express from "express";
import { getProducts, getProductQuantityInCart, } from "../controllers/productController.js";
// Creating an Express Router instance
const router = express.Router();
router.get("/products-in-cart", getProductQuantityInCart);
router.get("/", getProducts);
export default router;
