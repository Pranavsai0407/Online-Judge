const {Router} = require('express');
const router= Router();
const {authenticateToken} = require('../middlewares/auth.js');
const {getCurrentUser, getUserType,getAllUsers} =  require('../controllers/userControllers.js');
const multer = require('multer');
const path = require('path');
const User = require('../models/user'); // Adjust the path as per your project structure


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile'); // Uploads folder for profile images
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST route for updating profile image
router.post('/updateProfileImage', authenticateToken,upload.single('profileImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        // Assuming you have a userId passed in the request body or through authentication
        const userId = req.user._id; // Adjust as per your authentication setup

        // Update user's photo path in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Save file path or handle further processing (e.g., update database)
        const filePath = req.file.path;

        // Update user document with new photo path
        user.photo = filePath;
        await user.save();

        // Respond with the saved file path or other relevant data
        res.json({ imagePath: filePath });
    } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).json({ error: 'Server error.' });
    }
});

router.get("/current-user",authenticateToken, getCurrentUser);
router.get("/getAllusers",authenticateToken, getAllUsers);
router.post("/userType",authenticateToken,getUserType);


module.exports = router;