import express from "express";

const router = express.Router();

// API Documentation data
const apiDocumentation = {
  title: "Orebi E-commerce API Documentation",
  version: "1.0.0",
  description: "Complete API documentation for the Orebi e-commerce platform",
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://your-domain.com"
      : "http://localhost:4000",
  lastUpdated: new Date().toISOString(),

  endpoints: {
    // User Authentication Endpoints
    authentication: {
      title: "🔐 Authentication Endpoints",
      description: "User registration, login, and authentication management",
      endpoints: [
        {
          method: "POST",
          path: "/api/user/register",
          description: "Register a new user account",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer token (for admin creating users)",
          },
          body: {
            name: "string (required)",
            email: "string (required)",
            password: "string (required, min 8 characters)",
            role: "string (optional, default: 'user')",
            isActive: "boolean (optional, default: true)",
            address: {
              street: "string (optional)",
              city: "string (optional)",
              state: "string (optional)",
              zipCode: "string (optional)",
              country: "string (optional)",
              phone: "string (optional)",
            },
          },
          response: {
            success: "boolean",
            message: "string",
            user: "object (user data without password)",
            token: "string (JWT token)",
          },
        },
        {
          method: "POST",
          path: "/api/user/login",
          description: "User login",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            email: "string (required)",
            password: "string (required)",
          },
          response: {
            success: "boolean",
            message: "string",
            user: "object (user data)",
            token: "string (JWT token)",
          },
        },
        {
          method: "POST",
          path: "/api/user/admin",
          description: "Admin login with role verification",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            email: "string (required)",
            password: "string (required)",
          },
          response: {
            success: "boolean",
            message: "string",
            user: "object (admin user data)",
            token: "string (JWT token)",
          },
        },
      ],
    },

    // User Management Endpoints
    userManagement: {
      title: "👥 User Management Endpoints",
      description: "CRUD operations for user management (Admin only)",
      endpoints: [
        {
          method: "GET",
          path: "/api/user/users",
          description: "Get all users (Admin only)",
          headers: {
            token: "Bearer token (admin required)",
          },
          response: {
            success: "boolean",
            users: "array (list of all users with full details)",
            message: "string",
          },
        },
        {
          method: "GET",
          path: "/api/user/profile",
          description: "Get current user profile",
          headers: {
            token: "Bearer token (user token)",
            Authorization: "Bearer token (alternative)",
          },
          response: {
            success: "boolean",
            user: "object (user profile data)",
            message: "string",
          },
        },
        {
          method: "PUT",
          path: "/api/user/update/:id",
          description:
            "Update user profile (Admin only for role/status changes)",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer token",
          },
          params: {
            id: "string (user ID)",
          },
          body: {
            name: "string (optional)",
            email: "string (optional)",
            password: "string (optional)",
            role: "string (optional, admin only)",
            isActive: "boolean (optional, admin only)",
            address: "object (optional)",
          },
          response: {
            success: "boolean",
            message: "string",
            user: "object (updated user data)",
          },
        },
        {
          method: "POST",
          path: "/api/user/remove",
          description: "Delete a user (Admin only)",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer token (admin required)",
          },
          body: {
            _id: "string (user ID to delete)",
          },
          response: {
            success: "boolean",
            message: "string",
          },
        },
      ],
    },

    // Product Management Endpoints
    productManagement: {
      title: "📦 Product Management Endpoints",
      description: "CRUD operations for product management",
      endpoints: [
        {
          method: "GET",
          path: "/api/product/list",
          description: "Get all products",
          response: {
            success: "boolean",
            products: "array (list of all products)",
            message: "string",
          },
        },
        {
          method: "POST",
          path: "/api/product/add",
          description: "Add new product (Admin only)",
          headers: {
            "Content-Type": "multipart/form-data",
            token: "Bearer token (admin required)",
          },
          body: {
            name: "string (required)",
            description: "string (required)",
            price: "number (required)",
            category: "string (required)",
            subCategory: "string (required)",
            sizes: "array (optional)",
            bestseller: "boolean (optional)",
            image1: "file (required)",
            image2: "file (optional)",
            image3: "file (optional)",
            image4: "file (optional)",
          },
          response: {
            success: "boolean",
            message: "string",
            product: "object (created product data)",
          },
        },
        {
          method: "POST",
          path: "/api/product/remove",
          description: "Remove product (Admin only)",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer token (admin required)",
          },
          body: {
            id: "string (product ID to remove)",
          },
          response: {
            success: "boolean",
            message: "string",
          },
        },
        {
          method: "POST",
          path: "/api/product/single",
          description: "Get single product details",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            productId: "string (product ID)",
          },
          response: {
            success: "boolean",
            product: "object (product details)",
            message: "string",
          },
        },
      ],
    },

    // Order Management Endpoints
    orderManagement: {
      title: "🛒 Order Management Endpoints",
      description: "Order processing and management",
      endpoints: [
        {
          method: "GET",
          path: "/api/order/list",
          description: "Get all orders (Admin only)",
          headers: {
            token: "Bearer token (admin required)",
          },
          response: {
            success: "boolean",
            orders: "array (list of all orders)",
            message: "string",
          },
        },
        {
          method: "POST",
          path: "/api/order/status",
          description: "Update order status (Admin only)",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer token (admin required)",
          },
          body: {
            orderId: "string (order ID)",
            status: "string (new status)",
          },
          response: {
            success: "boolean",
            message: "string",
          },
        },
        {
          method: "POST",
          path: "/api/order/place",
          description: "Place a new order",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer token (user token)",
          },
          body: {
            items: "array (cart items)",
            amount: "number (total amount)",
            address: "object (shipping address)",
          },
          response: {
            success: "boolean",
            message: "string",
            order: "object (order details)",
          },
        },
        {
          method: "POST",
          path: "/api/order/userorders",
          description: "Get user's orders",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer token (user token)",
          },
          response: {
            success: "boolean",
            orders: "array (user's orders)",
            message: "string",
          },
        },
      ],
    },
  },

  // Authentication & Authorization
  authentication: {
    title: "🔒 Authentication & Authorization",
    description: "How to authenticate and authorize API requests",
    tokenFormat: "Bearer <your-jwt-token>",
    headerName: "token",
    alternativeHeader: "Authorization: Bearer <your-jwt-token>",
    tokenExpiry: "10 hours",
    roles: {
      admin: "Full access to all endpoints including user management",
      user: "Access to user-specific endpoints and product browsing",
    },
    examples: {
      loginFlow: [
        "1. POST /api/user/login with email and password",
        "2. Receive JWT token in response",
        "3. Include token in subsequent requests via 'token' header",
        "4. For admin operations, ensure user has 'admin' role",
      ],
    },
  },

  // Error Codes
  errorCodes: {
    title: "⚠️ Error Codes & Responses",
    description: "Common error responses and their meanings",
    codes: {
      400: {
        description: "Bad Request - Invalid input data",
        example: {
          success: false,
          message: "Please enter a valid email address",
        },
      },
      401: {
        description: "Unauthorized - Invalid or missing token",
        example: {
          success: false,
          message: "Not Authorized, login required",
        },
      },
      403: {
        description: "Forbidden - Insufficient permissions",
        example: {
          success: false,
          message: "Admin access required",
        },
      },
      404: {
        description: "Not Found - Resource doesn't exist",
        example: {
          success: false,
          message: "User not found",
        },
      },
      500: {
        description: "Internal Server Error",
        example: {
          success: false,
          message: "An internal server error occurred",
        },
      },
    },
  },

  // Data Models
  dataModels: {
    title: "📋 Data Models",
    description: "Data structure definitions for API objects",
    models: {
      User: {
        _id: "ObjectId (MongoDB ID)",
        name: "string",
        email: "string (unique)",
        password: "string (hashed)",
        role: "string (enum: 'user', 'admin')",
        isActive: "boolean",
        address: {
          street: "string",
          city: "string",
          state: "string",
          zipCode: "string",
          country: "string",
          phone: "string",
        },
        orders: "array (ObjectId references)",
        userCart: "object (product cart data)",
        lastLogin: "Date",
        createdAt: "Date",
        updatedAt: "Date",
      },
      Product: {
        _id: "ObjectId",
        name: "string",
        description: "string",
        price: "number",
        image: "array (image URLs)",
        category: "string",
        subCategory: "string",
        sizes: "array",
        bestseller: "boolean",
        date: "number (timestamp)",
        createdAt: "Date",
        updatedAt: "Date",
      },
      Order: {
        _id: "ObjectId",
        userId: "ObjectId (User reference)",
        items: "array (order items)",
        amount: "number",
        address: "object (shipping address)",
        status:
          "string (enum: 'Order Placed', 'Packing', 'Shipped', 'Delivered')",
        paymentMethod: "string",
        payment: "boolean",
        date: "number (timestamp)",
        createdAt: "Date",
        updatedAt: "Date",
      },
    },
  },

  // Rate Limiting & Best Practices
  bestPractices: {
    title: "✅ Best Practices",
    description: "Recommended practices for using the API",
    practices: [
      "Always include proper headers with Content-Type",
      "Handle authentication tokens securely",
      "Implement proper error handling for all requests",
      "Use HTTPS in production environments",
      "Validate input data before sending requests",
      "Store JWT tokens securely (localStorage for web apps)",
      "Refresh tokens when they're close to expiry",
      "Use appropriate HTTP methods (GET, POST, PUT, DELETE)",
      "Include meaningful error messages in responses",
    ],
    rateLimiting: {
      description: "API rate limiting information",
      limits: {
        authenticated: "1000 requests per hour",
        unauthenticated: "100 requests per hour",
      },
    },
  },
};

// GET /api/docs - Returns API documentation
router.get("/api/docs", (req, res) => {
  try {
    res.json({
      success: true,
      documentation: apiDocumentation,
      message: "API documentation retrieved successfully",
    });
  } catch (error) {
    console.log("API docs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve API documentation",
    });
  }
});

// GET /api/docs/html - Returns HTML formatted documentation
router.get("/api/docs/html", (req, res) => {
  try {
    const htmlDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${apiDocumentation.title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background: #f8fafc;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                border-radius: 10px;
                margin-bottom: 2rem;
                text-align: center;
            }
            .section {
                background: white;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .endpoint {
                border-left: 4px solid #3b82f6;
                padding-left: 1rem;
                margin: 1rem 0;
                background: #f8fafc;
                padding: 1rem;
                border-radius: 0 8px 8px 0;
            }
            .method {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-weight: bold;
                margin-right: 0.5rem;
                color: white;
            }
            .method.GET { background: #10b981; }
            .method.POST { background: #3b82f6; }
            .method.PUT { background: #f59e0b; }
            .method.DELETE { background: #ef4444; }
            code {
                background: #f1f5f9;
                padding: 0.2rem 0.4rem;
                border-radius: 4px;
                font-family: 'Monaco', 'Consolas', monospace;
            }
            pre {
                background: #1e293b;
                color: #e2e8f0;
                padding: 1rem;
                border-radius: 6px;
                overflow-x: auto;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1rem;
            }
            h1, h2, h3 { color: #1e293b; }
            .badge {
                background: #dbeafe;
                color: #1e40af;
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 500;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${apiDocumentation.title}</h1>
            <p>Version ${apiDocumentation.version} | Last Updated: ${new Date(
      apiDocumentation.lastUpdated
    ).toLocaleDateString()}</p>
            <p>${apiDocumentation.description}</p>
            <p><strong>Base URL:</strong> <code>${
              apiDocumentation.baseUrl
            }</code></p>
        </div>

        <div class="section">
            <h2>🚀 Quick Start</h2>
            <p>Welcome to the Orebi E-commerce API! This RESTful API provides comprehensive functionality for managing users, products, and orders.</p>
            
            <h3>Authentication</h3>
            <p>Most endpoints require authentication. Include your JWT token in the <code>token</code> header:</p>
            <pre>Headers: { "token": "your-jwt-token-here" }</pre>
        </div>

        ${Object.entries(apiDocumentation.endpoints)
          .map(
            ([key, section]) => `
            <div class="section">
                <h2>${section.title}</h2>
                <p>${section.description}</p>
                
                ${section.endpoints
                  .map(
                    (endpoint) => `
                    <div class="endpoint">
                        <h3>
                            <span class="method ${endpoint.method}">${
                      endpoint.method
                    }</span>
                            <code>${endpoint.path}</code>
                        </h3>
                        <p>${endpoint.description}</p>
                        
                        ${
                          endpoint.headers
                            ? `
                            <h4>Headers:</h4>
                            <pre>${JSON.stringify(
                              endpoint.headers,
                              null,
                              2
                            )}</pre>
                        `
                            : ""
                        }
                        
                        ${
                          endpoint.body
                            ? `
                            <h4>Request Body:</h4>
                            <pre>${JSON.stringify(endpoint.body, null, 2)}</pre>
                        `
                            : ""
                        }
                        
                        <h4>Response:</h4>
                        <pre>${JSON.stringify(endpoint.response, null, 2)}</pre>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `
          )
          .join("")}

        <div class="section">
            <h2>${apiDocumentation.authentication.title}</h2>
            <p>${apiDocumentation.authentication.description}</p>
            
            <div class="grid">
                <div>
                    <h3>Token Format</h3>
                    <code>${apiDocumentation.authentication.tokenFormat}</code>
                </div>
                <div>
                    <h3>Header Name</h3>
                    <code>${apiDocumentation.authentication.headerName}</code>
                </div>
                <div>
                    <h3>Token Expiry</h3>
                    <span class="badge">${
                      apiDocumentation.authentication.tokenExpiry
                    }</span>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>${apiDocumentation.errorCodes.title}</h2>
            <p>${apiDocumentation.errorCodes.description}</p>
            
            ${Object.entries(apiDocumentation.errorCodes.codes)
              .map(
                ([code, info]) => `
                <div class="endpoint">
                    <h3>${code} - ${info.description}</h3>
                    <pre>${JSON.stringify(info.example, null, 2)}</pre>
                </div>
            `
              )
              .join("")}
        </div>

        <div class="section">
            <h2>${apiDocumentation.bestPractices.title}</h2>
            <p>${apiDocumentation.bestPractices.description}</p>
            
            <ul>
                ${apiDocumentation.bestPractices.practices
                  .map((practice) => `<li>${practice}</li>`)
                  .join("")}
            </ul>
        </div>

        <footer style="text-align: center; margin-top: 3rem; padding: 2rem; color: #64748b;">
            <p>© 2025 Orebi E-commerce API Documentation</p>
        </footer>
    </body>
    </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(htmlDoc);
  } catch (error) {
    console.log("API docs HTML error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate HTML documentation",
    });
  }
});

export default router;
