# Dependencies & DevDependencies Explained

## **Dependencies** (Required for Production)

- **cors** – Enables Cross-Origin Resource Sharing (CORS) for API requests.
- **dotenv** – Loads environment variables from a `.env` file.
- **express** – Web framework for building API routes and handling HTTP requests.
- **mongoose** – ODM (Object-Document Mapping) for MongoDB, used to interact with the database.
- **tsconfig-paths** – Allows TypeScript to resolve module paths based on `tsconfig.json`.

## **DevDependencies** (Used for Development & Testing)

- **@types/cors** – Type definitions for CORS.
- **@types/dotenv** – Type definitions for dotenv.
- **@types/express** – Type definitions for Express.
- **@types/jest** – Type definitions for Jest.
- **@types/mongoose** – Type definitions for Mongoose.
- **@types/node** – Type definitions for Node.js.
- **@types/supertest** – Type definitions for Supertest.
- **cross-env** – Enables setting environment variables across different OSes.
- **jest** – JavaScript testing framework.
- **mongodb-memory-server** – In-memory MongoDB instance for testing.
- **nodemon** – Restarts the server automatically during development.
- **supertest** – Used for testing HTTP requests in Express apps.
- **ts-jest** – Jest transformer for testing TypeScript files.
- **ts-node** – Runs TypeScript files directly in Node.js.
- **typescript** – TypeScript compiler.

## **Scripts** (Common Commands)

- **build** – Compiles TypeScript files (`tsc`).
- **start** – Runs the app using Node.js.
- **dev** – Runs the app in development mode with automatic restarts (`nodemon`).
- **seed** – Runs the `seed.ts` script to populate the database.
- **seed-users** – Runs the `seed-users.ts` script to seed users into the database.
- **test** – Runs Jest tests with `cross-env` to ensure environment variables work.
