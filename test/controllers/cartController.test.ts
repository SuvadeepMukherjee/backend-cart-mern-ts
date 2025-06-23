import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import { Request, Response } from "express";
import { addToCart } from "../../controllers/cartController.js";

import { totalAmount } from "../../controllers/cartController.js"; // Adjust path as necessary
//import { IProduct } from "../../models/Product.ts";

// Mock Mongoose functions
// In Jest, `mock` replaces a module, function, or database with a fake version
// to control its behavior and test code in isolation without real dependencies.
jest.mock("../../models/Cart");
jest.mock("../../models/Product");

describe("GET /api/cart/:userId - Get Cart", () => {
  const mockUserId = "65c96f8a1a2b4c001f3d8e9a";

  // `afterEach` runs a cleanup function after each test to reset mocks, clear data, etc.
  // `afterAll` runs once after all tests complete, useful for closing DB connections or cleanup.
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should return a valid cart when found", async () => {
    // Define a mock cart object with a userId and items array
    const mockCart = {
      userId: mockUserId,
      items: [
        {
          product: {
            _id: "1",
            name: "IPhone",
            price: 999.0,
            image: "http://localhost:5000/images/1.png",
          },
          quantity: 2,
        },
      ],
    };

    // Mock Cart.findOne().populate() to return the mockCart object
    (Cart.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCart),
    });

    // Send a GET request to fetch the cart for the given userId
    const response = await request(app).get(`/api/cart/${mockUserId}`);

    // Check if the response status is 200 (OK)
    expect(response.status).toBe(200);

    // Verify that the response body matches the expected transformed cart structure
    expect(response.body).toEqual({
      userId: mockUserId,
      items: [
        {
          productId: "1",
          productName: "IPhone",
          price: 999.0,
          productImage: "http://localhost:5000/images/1.png",
          quantity: 2,
        },
      ],
    });
  });

  test("should return an empty cart when no cart exists", async () => {
    // Mock `Cart.findOne().populate()` to return null, simulating no cart found for the user
    (Cart.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    // Send a GET request to fetch the cart for the given userId
    const response = await request(app).get(`/api/cart/${mockUserId}`);

    // Check if the response status is 200 (OK)
    expect(response.status).toBe(200);
    // Verify that the response body is an empty cart (items array is empty)
    expect(response.body).toEqual({ items: [] });
  });

  test("should return 400 for invalid userId", async () => {
    // Send a GET request without providing a userId in the URL
    const response = await request(app).get(`/api/cart/`);

    // Expect a 404 status because the route does not match the expected endpoint
    expect(response.status).toBe(404);
  });

  // Test case to check if the API handles internal server errors properly
  test("should return 500 on internal server error", async () => {
    // Mock `Cart.findOne().populate()` to throw a database error
    (Cart.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    // Send a GET request to fetch the cart for the given userId
    const response = await request(app).get(`/api/cart/${mockUserId}`);

    // Expect a 500 status indicating an internal server error
    expect(response.status).toBe(500);

    // Verify that the response body contains an error message
    expect(response.body).toHaveProperty("message", "Server error");
  });
});

// Define the test suite for the `addToCart` controller
describe("addToCart Controller", () => {
  let mockReq: Partial<Request>; // Mocked request object
  let mockRes: Partial<Response>; // Mocked response object
  let jsonMock: jest.Mock; // Mock function for res.json()
  let statusMock: jest.Mock; // Mock function for res.status()

  // Setup before each test
  beforeEach(() => {
    jsonMock = jest.fn(); // Mock res.json()
    statusMock = jest.fn().mockReturnValue({ json: jsonMock }); // Mock res.status()

    // Define a default request body
    mockReq = {
      body: {
        userId: "user123",
        productId: "product123",
        quantity: 2,
      },
    };

    // Define a default response object
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks(); // Clear mocks to prevent test contamination
  });

  //Test case: Ensure the controller returns 400 if required fields are missing
  test("should return 400 if required fields are missing", async () => {
    // Set up mock request with missing/invalid fields
    mockReq.body = { userId: "", productId: "", quantity: 0 };

    // Call the addToCart controller function
    await addToCart(mockReq as Request, mockRes as Response);

    // Expect a 400 status indicating a bad request
    expect(statusMock).toHaveBeenCalledWith(400);

    // Expect the response JSON to contain an appropriate error message
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Invalid request parameters",
    });
  });

  //Passing
  test("should return 400 if product is not found", async () => {
    // Mock Product.findById to return null, simulating a missing product
    (Product.findById as jest.Mock).mockResolvedValue(null);

    // Call the addToCart controller function
    await addToCart(mockReq as Request, mockRes as Response);

    // Ensure Product.findById was called with the correct productId
    expect(Product.findById).toHaveBeenCalledWith("product123");

    // Expect a 400 status indicating the product was not found
    expect(statusMock).toHaveBeenCalledWith(400);

    // Expect the response JSON to contain an appropriate error message
    expect(jsonMock).toHaveBeenCalledWith({ message: "Product not found" });
  });

  //Test Case: should create a new cart if user has no existing cart
  // passing
  test("should create a new cart if user has no existing cart", async () => {
    // Mock the request body to ensure `productId` is a number
    mockReq.body = { userId: "user123", productId: 123, quantity: 2 };

    //Mock the Product.findById function to return a product with _id:123
    (Product.findById as jest.Mock).mockResolvedValue({ _id: 123 });

    // Mock the `Cart.findOne` function to return `null`, indicating no existing cart for the user
    (Cart.findOne as jest.Mock).mockResolvedValue(null);

    // Create a mock cart object
    const mockCart = {
      userId: "user123",
      items: [],
      save: jest.fn().mockResolvedValue({
        _id: "cart123",
        userId: "user123",
        items: [{ product: 123, quantity: 2 }],
      }),
    };

    // Mock the Cart constructor to return the mockCart instance
    (Cart as unknown as jest.Mock).mockImplementation(() => mockCart);

    // Call the `addToCart` controller function with mock request and response objects
    await addToCart(mockReq as Request, mockRes as Response);

    // console.log("Final Response Status:", statusMock.mock.calls);
    // console.log(
    //   "Final Response JSON:",
    //   JSON.stringify(jsonMock.mock.calls, null, 2)
    // );

    // Verify that the response status was set to 200 (OK)
    expect(statusMock).toHaveBeenCalledWith(200);

    // Verify that the response JSON contains the expected success message and cart structure
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Item added to cart successfully",
        cart: expect.objectContaining({
          userId: "user123",
          items: expect.arrayContaining([
            expect.objectContaining({
              product: 123,
              quantity: 2,
            }),
          ]),
        }),
      })
    );
  });

  //passing
  //Test case to check if the cart updates the quantity of a product that already exists
  test("should update quantity if product already exists in cart", async () => {
    // Create a mock cart representing an existing cart with a product having quantity 1
    const mockCart = {
      userId: "user123",
      items: [{ product: "product123", quantity: 1 }],
      // Mock the `save` method to simulate saving the updated cart in the database
      save: jest.fn().mockResolvedValue({
        userId: "user123",
        items: [{ product: "product123", quantity: 3 }], // Expected updated quantity
      }),
    };

    // Mock the `Product.findById` function to return a product object with the given ID
    (Product.findById as jest.Mock).mockResolvedValue({ _id: "product123" });

    // Mock the `Cart.findOne` function to return the mockCart, simulating an existing cart in the database
    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

    // Call the `addToCart` controller function with mock request and response objects
    await addToCart(mockReq as Request, mockRes as Response);

    // Verify that the `save` method was called on the mock cart (meaning it was updated)
    expect(mockCart.save).toHaveBeenCalled();

    // Verify that the response status was set to 200 (OK)
    expect(statusMock).toHaveBeenCalledWith(200);

    // Verify that the response JSON contains the expected success message and updated cart structure
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Item added to cart successfully",
        cart: expect.objectContaining({
          userId: "user123",
          items: expect.arrayContaining([
            expect.objectContaining({
              product: "product123",
              quantity: 3,
            }),
          ]),
        }),
      })
    );
  });

  //passing in jest
  test("should handle server errors", async () => {
    // Mock Product.findById to throw a database error
    (Product.findById as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    // Call the addToCart controller function with mock request and response objects
    await addToCart(mockReq as Request, mockRes as Response);

    // Verify that the response status was set to 500 (Internal Server Error)
    expect(statusMock).toHaveBeenCalledWith(500);

    // Verify that the response JSON contains the appropriate error message
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Server error",
      error: expect.any(Error),
    });
  });
});

describe("totalAmount Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    req = { query: { userId: "123" } };
    res = { json: jsonMock, status: statusMock };

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("should return total amount when cart exists", async () => {
    // Mock Product
    const mockProduct = {
      _id: "product123",
      productName: "Laptop",
      price: 1000,
      productImage: "laptop.jpg",
      description: "Gaming Laptop",
      category: "laptop",
    };

    // Mock Cart
    const mockCart = {
      userId: "user123",
      items: [
        { product: mockProduct, quantity: 2 }, // 2 * 1000 = 2000
        { product: mockProduct, quantity: 1 }, // 1 * 1000 = 1000
      ],
    };

    // Mock the `findOne` call to return the fake cart
    (Cart.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCart),
    });

    const response = await request(app)
      .get("/api/cart/totalAmount")
      .query({ userId: "user123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalAmount: 3000 });
  });

  test("should return 0 when cart does not exist", async () => {
    (Cart.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await totalAmount(req as Request, res as Response);

    expect(jsonMock).toHaveBeenCalledWith({ totalAmount: 0 });
  });

  test("should return 400 if userId is missing", async () => {
    req.query = {}; // No userId

    await totalAmount(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "User ID is required and must be a string",
    });
  });

  test("should return 500 on database error", async () => {
    (Cart.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    await totalAmount(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});

describe("GET /api/cart/numberCart", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Passing
  test("should return total number of items in cart when cart exists", async () => {
    // Mock cart with items
    const mockCart = {
      userId: "user123",
      items: [
        { product: "product123", quantity: 2 },
        { product: "product456", quantity: 3 },
      ],
    };

    // Mock findOne() to return the cart
    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

    const response = await request(app)
      .get("/api/cart/numberCart")
      .query({ userId: "user123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalItems: 5 });
  });

  //Passing
  test("should return totalItems: 0 when cart does not exist", async () => {
    // Mock findOne() to return null
    (Cart.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get("/api/cart/numberCart")
      .query({ userId: "user123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalItems: 0 });
  });

  //Passing
  test("should return totalItems: 0 when cart exists but has no items", async () => {
    // Mock cart with no items
    const mockCart = { userId: "user123", items: [] };

    // Mock findOne() to return the empty cart
    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

    const response = await request(app)
      .get("/api/cart/numberCart")
      .query({ userId: "user123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalItems: 0 });
  });

  //Passing
  test("should return 400 if userId is missing", async () => {
    const response = await request(app).get("/api/cart/numberCart");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "User ID is required and must be a string",
    });
  });

  //Not Passing
  test("should handle internal server error", async () => {
    // Mock findOne() to throw an error
    (Cart.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/api/cart/numberCart")
      .query({ userId: "user123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("DELETE /api/cart/remove", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Pass
  test("should return 400 if userId or productId is missing", async () => {
    const response = await request(app).delete("/api/cart/remove").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Missing userId or productId" });
  });

  // Passed
  test("should return 404 if cart does not exist", async () => {
    (Cart.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .delete("/api/cart/remove")
      .send({ userId: "user123", productId: "product123" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Cart not found" });
  });

  // Passed
  test("should return 404 if item is not in cart", async () => {
    (Cart.findOne as jest.Mock).mockResolvedValue({
      userId: "user123",
      items: [], // Empty cart
      save: jest.fn(),
    });

    const response = await request(app)
      .delete("/api/cart/remove")
      .send({ userId: "user123", productId: "product123" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Item not in cart" });
  });

  // Passed
  test("should decrease quantity if item quantity is more than 1", async () => {
    const mockCart = {
      userId: "user123",
      items: [{ product: "product123", quantity: 2 }],
      save: jest.fn().mockResolvedValue(true),
    };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

    const response = await request(app)
      .delete("/api/cart/remove")
      .send({ userId: "user123", productId: "product123" });

    expect(response.status).toBe(200);
    expect(mockCart.items[0].quantity).toBe(1);
    const expectedCart = JSON.parse(JSON.stringify(mockCart));
    delete expectedCart.save;

    expect(response.body).toEqual({
      message: "Item removed from cart",
      cart: expectedCart,
    });
  });

  //pass
  test("should remove item if quantity is 1", async () => {
    const mockCart = {
      userId: "user123",
      items: [{ product: "product123", quantity: 1 }],
      save: jest.fn().mockResolvedValue(true),
    };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

    const response = await request(app)
      .delete("/api/cart/remove")
      .send({ userId: "user123", productId: "product123" });

    expect(response.status).toBe(200);
    expect(mockCart.items.length).toBe(0);
    expect(response.body).toEqual({
      message: "Cart is now empty",
      cart: null,
    });
  });

  //pass
  test("should delete cart if last item is removed", async () => {
    const mockCart = {
      userId: "user123",
      items: [{ product: "product123", quantity: 1 }],
    };

    (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
    (Cart.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const response = await request(app)
      .delete("/api/cart/remove")
      .send({ userId: "user123", productId: "product123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Cart is now empty",
      cart: null,
    });
  });

  //pass
  test("should return 500 if there is a server error", async () => {
    (Cart.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .delete("/api/cart/remove")
      .send({ userId: "user123", productId: "product123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Server error" });
  });
});
