import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
/**
 * Retrieves products from the database with optional category filtering.
 * - If a category is provided, filters products accordingly; otherwise, returns all products.
 */
//Promise<void> indicates that this function does not explicitly return a value
const getProducts = async (req, res) => {
    try {
        //extracts category from request query parameters
        const { category } = req.query;
        // Initializes an empty query object to store filtering conditions.
        // Record<string, unknown> is a TypeScript generic type.
        // - Record<K, T> is a generic utility type in TypeScript.
        // - K (the first parameter) represents the keys, which must be of type string.
        // - T (the second parameter) represents the values, which are unknown here (any type)
        // - This ensures that query is an object where all keys are strings, and the values can be of any type.
        let query = {};
        // If a category is provided, is not "all", and is a valid string, add it to the query object.
        if (category && category !== "all" && typeof category === "string") {
            query.category = category; // Filters products based on the specified category.
        }
        // Queries the database for products that match the filtering criteria.
        const products = await Product.find(query);
        // Sends the retrieved products as a JSON response.
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products" });
    }
};
/**
 * Retrieves the quantity of products in a user's cart.
 */
const getProductQuantityInCart = async (req, res) => {
    try {
        //Extract userId from query parameters
        const { userId } = req.query;
        //Validate userId
        if (!userId || typeof userId !== "string") {
            res
                .status(400)
                .json({ message: "userId is required and must be a string" });
            return;
        }
        //console.log(`Searching for cart with userId:${userId}`);
        const cartWithoutPopulate = await Cart.findOne({ userId });
        // Find the cart for the given user and populate product details
        const cart = await Cart.findOne({ userId }).populate("items.product");
        //console.log(`Cart found:`, cart);
        // If no cart is found, return a 404 error
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        // Extract product and quantity details from the cart items
        const cartItems = cart.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
        }));
        // Respond with the cart details
        res.json({ userId, cartItems });
    }
    catch (error) {
        console.log("Error in getProductQuantityInCart", error);
        res.status(500).json({ message: "Server error" });
    }
};
export { getProducts, getProductQuantityInCart };
