import request from "supertest";
import app from "../../app.js";
import Product from "../../models/Product.js";
import Cart from "../../models/Cart.js";
import mongoose from "mongoose";
// Mock the Product and Cart models
jest.mock("../../models/Product");
jest.mock("../../models/Cart");
describe("GET /api/products/products-in-cart", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    //Passing test case
    test("should return 400 if userId is missing", async () => {
        const response = await request(app).get("/api/products/products-in-cart");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "userId is required and must be a string",
        });
    });
    //Passing
    test("should return 404 if cart is not found", async () => {
        // Tell TypeScript to treat Cart.findOne as a Jest mock function
        Cart.findOne.mockReturnValue({
            // Mock the `populate` method to return a resolved Promise with `null`
            // This simulates the scenario where no cart is found in the database
            populate: jest.fn().mockResolvedValue(null),
        });
        const response = await request(app).get("/api/products/products-in-cart?userId=123");
        console.log("Test Response:", response.body);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Cart not found" });
    });
    //Passing
    test("should return 200 and cart items if cart exists", async () => {
        const mockCart = {
            userId: "123",
            items: [
                { product: { _id: "1", productName: "IPhone" }, quantity: 2 },
                { product: { _id: "2", productName: "Macbook" }, quantity: 1 },
            ],
        };
        Cart.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockCart), // Mock `populate()`
        });
        const response = await request(app).get("/api/products/products-in-cart?userId=123");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            userId: "123",
            cartItems: [
                { product: { _id: "1", productName: "IPhone" }, quantity: 2 },
                { product: { _id: "2", productName: "Macbook" }, quantity: 1 },
            ],
        });
    });
    test("should return 500 on server error", async () => {
        Cart.findOne.mockRejectedValue(new Error("Database error"));
        const response = await request(app).get("/api/products/products-in-cart?userId=123");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Server error" });
    });
});
describe("Product Controller", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clears all mocks after each test
    });
    afterAll(async () => {
        await mongoose.connection.close(); // Close the database connection after all tests
    });
    /**
     *  Test 1: Fetch all products (Passing)
     */
    test("GET /api/products - should return all products", async () => {
        const mockProducts = [
            {
                _id: 1,
                productName: "Laptop A",
                price: 1000,
                productImage: "laptop.jpg",
                description: "High-performance laptop",
                category: "laptop",
            },
            {
                _id: 2,
                productName: "Mobile B",
                price: 500,
                productImage: "mobile.jpg",
                description: "Latest smartphone",
                category: "mobile",
            },
        ];
        Product.find.mockResolvedValue(mockProducts);
        const response = await request(app).get("/api/products");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({});
    });
    /**
     *  Test 2: Fetch products by category (Passing)
     */
    test("GET /api/products?category=laptop - should return only laptops", async () => {
        const mockLaptops = [
            {
                _id: 1,
                productName: "Laptop A",
                price: 1000,
                productImage: "laptop.jpg",
                description: "High-performance laptop",
                category: "laptop",
            },
        ];
        Product.find.mockResolvedValue(mockLaptops);
        const response = await request(app).get("/api/products?category=laptop");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockLaptops);
        expect(Product.find).toHaveBeenCalledWith({ category: "laptop" });
    });
    /**
     *  Test 3: Handle database errors in `getProducts` (Passing)
     */
    test("GET /api/products - should return 500 if database error occurs", async () => {
        Product.find.mockRejectedValue(new Error("Database error"));
        const response = await request(app).get("/api/products");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error fetching products" });
    });
    /**
     *  Test 5: Handle missing userId in `getProductQuantityInCart`(Passing)
     */
    test("GET /api/products/products-in-cart - should return 400 if userId is missing", async () => {
        const response = await request(app).get("/api/products/products-in-cart");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "userId is required and must be a string",
        });
    });
    /**
     *  Test 6: Handle missing cart in `getProductQuantityInCart`(Passing)
     */
    test("GET /api/products/products-in-cart?userId=999 - should return 404 if cart is not found", async () => {
        Cart.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });
        const response = await request(app).get("/api/products/products-in-cart?userId=999");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Cart not found" });
    });
    /**
     *  Test 7: Handle database errors in `getProductQuantityInCart`(Passing)
     */
    test("GET /api/products/products-in-cart?userId=123 - should return 500 if database error occurs", async () => {
        Cart.findOne.mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error("Database error")),
        });
        const response = await request(app).get("/api/products/products-in-cart?userId=123");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Server error" });
    });
});
describe("GET /api/products", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clears mocks after each test
    });
    //Passing
    test("should return all products when no category is specified", async () => {
        const mockProducts = [
            { _id: "1", name: "Product 1", category: "electronics" },
            { _id: "2", name: "Product 2", category: "clothing" },
        ];
        // Mock Product.find() to return mockProducts
        Product.find.mockResolvedValue(mockProducts);
        const response = await request(app).get("/api/products"); // Send GET request
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({}); // Ensure Product.find was called with an empty query
    });
    test("should return products filtered by category", async () => {
        const mockProducts = [
            { _id: "1", name: "Laptop", category: "electronics" },
        ];
        // Mock Product.find() to return filtered products
        Product.find.mockResolvedValue(mockProducts);
        const response = await request(app)
            .get("/api/products")
            .query({ category: "electronics" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({ category: "electronics" });
    });
    test("should return a 500 error if fetching products fails", async () => {
        // Mock Product.find() to throw an error
        Product.find.mockRejectedValue(new Error("Database error"));
        const response = await request(app).get("/api/products");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error fetching products" });
    });
});
