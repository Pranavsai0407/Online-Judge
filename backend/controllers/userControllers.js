const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Custom error handling class
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Custom response handling class
class ApiResponse {
    constructor(statusCode, data) {
        this.statusCode = statusCode;
        this.data = data;
    }
}

// Middleware for async error handling
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
});

const getUserType = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(403).json(new ApiResponse(
            403,
            null,
            "User is not authenticated"
        ));
    }

    const userType = req.user.admin ? "admin" : "user";

    return res.status(200).json(new ApiResponse(
        200,
        {
            userType: userType
        },
        `User type fetched successfully: ${userType}`
    ));
});

module.exports = {getCurrentUser,getUserType};

