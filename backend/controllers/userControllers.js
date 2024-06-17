const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  User  = require("../models/user");

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
        //console.log("error");
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
const uploadProfilePhoto = asyncHandler(async (req, res) => {
    if (req.file) {
        const imageUrl = req.file.path;
        const userId = req.user._id;

        // Fetch the user
        const user = await User.findById(userId);

        // If user already has a photo, delete it from Cloudinary
        if (user.photo) {
            let publicId = user.photo.split('/').pop().split('.')[0];
            publicId = 'onlineJudge/' + publicId;
            console.log(publicId);
            await cloudinary.uploader.destroy(publicId);
        }

        // Update the photo field
        user.photo = imageUrl;

        // Save the user
        await user.save();

        res.json(new ApiResponse(
            200,
            { imageUrl },
            "Profile photo uploaded successfully"
        ));
    } else {
        throw new ApiError(400, "Please upload a file")
    }
})


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
});

module.exports = {getCurrentUser,getUserType,getAllUsers,uploadProfilePhoto};

