const {Router} = require('express');
const router= Router();
const {authenticateToken} = require('../middlewares/auth.js');
const {getCurrentUser, getUserType} =  require('../controllers/userControllers.js');


router.get("/current-user",authenticateToken, getCurrentUser);
router.post("/userType",authenticateToken,getUserType);

module.exports = router;