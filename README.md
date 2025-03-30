Express.js API for Environment Variables Management
A lightweight API built with JavaScript and Express.js to demonstrate creating and managing environment variables, handling errors gracefully, and organizing files for a clean structure. It also includes API testing using Postman.

Features
Environment Variable Management: Load and manage .env variables securely using the dotenv package.

Error Handling: Centralized error-handling middleware for consistent responses.

File Structure: Well-organized project structure for scalability.

Postman API Testing: Pre-configured API routes for testing environment variables.

Scalable Architecture: A base foundation ready for expansion.

project-root/
│
├── .env                  # Environment variables
├── package.json          # Project metadata and dependencies
├── index.js             # Entry point for the application
│
├── controllers/          # Contains route register, login, logout
│   └── configController.js
│
├── middleware/           # Middleware for middlerware router
│   └── Middleware.js
│
├── routes/               # API route definitions
│   └── UserRoutes.js
│
├── utils/                # Utility functions
│   └── ApiError
│
└── tests/                # Postman or test Api 
    └── postman
