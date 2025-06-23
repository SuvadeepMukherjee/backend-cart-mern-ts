import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
/**
 * Controller to retrieve a user's shopping cart.(Jest passed)
 * Return type `Promise<void>` indicates an async function that does not explicitly return a value.
 */
const getCart = async (req, res) => {
    try {
        //Extracts userId from request parameters
        const { userId } = req.params;
        //Validation to ensure userId is a string
        if (!userId || typeof userId !== "string") {
            res.status(400).json({ message: "Invalid userId" });
            return;
        }
        // Fetches the cart for the given userId from the database
        // Uses populate("items.product") to replace product IDs in items with actual product details
        const cart = await Cart.findOne({ userId }).populate("items.product");
        //If no cart is found or it's empty , return an empty items array
        if (!cart || cart.items.length === 0) {
            res.status(200).json({ items: [] });
            return;
        }
        //Formats the cart data for response
        const formattedCart = {
            //userId taken from cart document
            userId: cart.userId,
            items: cart.items
                //Filters out items without a valid product
                .filter((item) => item.product)
                .map((item) => ({
                // Extracts product details after populating
                // Extracts product ID after populating
                productId: item.product._id, //`as any` is used to bypass TypeScript's strict typing
                // Retrieves the product name; defaults to "Product" if name is missing
                productName: item.product.name || "Product",
                // Retrieves the product price; defaults to 0 if price is missing
                price: item.product.price || 0,
                // Retrieves the product image URL; defaults to an empty string if missing
                productImage: item.product.image || "",
                // Retrieves the quantity of the product in the cart
                quantity: item.quantity,
            })),
        };
        // Sends the formatted cart data as a JSON response with HTTP status 200 (OK)
        res.status(200).json(formattedCart);
    }
    catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
/**
 * Controller to add a product to a user's shopping cart.(Jest Passed)
 */
const addToCart = async (req, // Custom request type ensuring body contains userId,productId and quantity
res // Express Response object used for sending responses
) => {
    // Return type Promise<void> indicates an async function that does not explicitly return a value.
    try {
        // Destructuring request body
        const { userId, productId, quantity } = req.body;
        //console.log("Request Body", req.body);
        // validate input parameters : ensure userId and productId exist and quantity is greater than 0
        if (!userId || !productId || quantity <= 0) {
            res.status(400).json({ message: "Invalid request parameters" });
            return; // Ensures early function exit on validation failure
        }
        // Fetch product from  database using productId
        const product = await Product.findById(productId);
        if (!product) {
            res.status(400).json({ message: "Product not found" });
            return; //Exit function if product is not found
        }
        //console.log("Product fetched from DB:", product);
        // Find the cart associated with the userId
        let cart = await Cart.findOne({ userId });
        //console.log("Cart fetched from DB:", cart);
        // If the user does not have a cart, create a new one
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        //console.log("Newly created cart before saving:", cart);
        // Ensures items is always an array
        cart.items = cart.items || []; // Initialize a new cart with an empty items array
        // Check if the product already exists in the cart
        const existingItemIndex = cart.items.findIndex((item) => String(item.product) === String(productId));
        if (existingItemIndex !== -1) {
            // If product exists in cart, update the quantity
            cart.items[existingItemIndex].quantity += quantity;
        }
        else {
            // If product is not in the cart, add a new item with the given quantity
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        console.log("Cart after saving:", await Cart.findOne({ userId }));
        //console.log("Cart before sending response", cart);
        // Send a success response with the updated cart details
        res.status(200).json({ message: "Item added to cart successfully", cart });
        //console.log("response send", cart);
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
/**
 *Controller to calculate the total amount of items in a user's cart.
 */
// req: Request represents the incoming request object.
// res: Response is used to send back the response.
// Promise<void> indicates that this function is asynchronous and does not return a value directly
const totalAmount = async (req, res) => {
    try {
        // Extracts userId from the request query parameters.
        const { userId } = req.query;
        // Validates userId: ensures it exists and is of type string.
        if (!userId || typeof userId !== "string") {
            res
                .status(400)
                .json({ message: "User ID is required and must be a string" });
            return;
        }
        // Searches for the user's cart in the database and populates product details.
        const cart = await Cart.findOne({ userId }).populate("items.product");
        // If the cart does not exist, return a total amount of 0.
        if (!cart) {
            res.json({ totalAmount: 0 });
            return;
        }
        let totalAmount = 0;
        // Iterates over each item in the cart to calculate the total cost.
        for (const item of cart.items) {
            const product = item.product; // Explicitly cast item.product as IProduct
            // Ensures product exists and has a price property before performing calculations.
            if (product && typeof product === "object" && "price" in product) {
                totalAmount += product.price * item.quantity;
            }
        }
        res.json({ totalAmount });
    }
    catch (error) {
        console.error("Error fetching total cart amount:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
/**
 * Controller to get the total number of items in a user's cart
 */
// req: Request represents the incoming request.
// res: Response is used to send the response.
// Promise<void> indicates that this function does not return a value explicitly.
const numberCart = async (req, res) => {
    try {
        // Extracts userId from the request query parameters.
        const { userId } = req.query;
        // Validates userId: ensures it exists and is of type string.
        if (!userId || typeof userId !== "string") {
            res
                .status(400)
                .json({ message: "User ID is required and must be a string" });
            return; // Exits the function early to prevent further execution.
        }
        // Finds the cart associated with the userId in the database.
        const cart = await Cart.findOne({ userId });
        // If the cart does not exist or is empty, return totalItems: 0.
        if (!cart || !cart.items.length) {
            res.status(200).json({ totalItems: 0 });
            return;
        }
        // Calculates the total number of items in the cart.
        // Uses .reduce() to iterate over the items array, summing up the quantity of each item.
        const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        // Sends the total number of items in the cart as a JSON response.
        res.status(200).json({ totalItems });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
/**
 * Controller to remove an item from a user's shopping cart.
 */
//req:Request represents the incoming request
//res:Response is used to send back the response
//Promise<void> indicates that this function does not explicitly return a value
const removeFromCart = async (req, res) => {
    try {
        //Extract userId and productId from the request body
        const { userId, productId } = req.body;
        // Validates that both userId and productId are provided
        if (!userId || !productId) {
            res.status(400).json({ error: "Missing userId or productId" });
            return; //Exists early if validation fails
        }
        // Find the user's cart in the database based on userId
        const cart = await Cart.findOne({ userId });
        // If cart does not exist, return a 404 Not Found response
        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }
        // Find the index of the product in the cart's items array
        // The "!" (non-null assertion operator) tells TypeScript that "cart" is not null or undefined.
        // This allows us to access "cart.items" without TypeScript throwing an error.
        const existingItemIndex = cart.items.findIndex((item) => String(item.product) === String(productId));
        // If the product is not found in the cart, return a 404 NoT found response
        if (existingItemIndex === -1) {
            res.status(404).json({ error: "Item not in cart" });
            return;
        }
        // Check if the item's quantity is more than 1, then decrement quantity
        // The "!" (non-null assertion operator) tells TypeScript that "cart" is not null or undefined.
        if (cart.items[existingItemIndex].quantity > 1) {
            cart.items[existingItemIndex].quantity -= 1;
        }
        else {
            // If quantity is 1, remove the item from the cart completely.
            cart.items.splice(existingItemIndex, 1);
        }
        // The "!" (non-null assertion operator) tells TypeScript that "cart" is not null or undefined.
        // If cart is empty, delete it
        if (cart.items.length === 0) {
            await Cart.deleteOne({ userId });
            res.status(200).json({ message: "Cart is now empty", cart: null });
            return; //Exit early after deleting the cart
        }
        await cart.save();
        // Send a success response with the updated cart details
        res.status(200).json({ message: "Item removed from cart", cart });
    }
    catch (error) {
        console.error("Error removing item:", error);
        res.status(500).json({ error: "Server error" });
    }
};
export { getCart, addToCart, totalAmount, numberCart, removeFromCart };
