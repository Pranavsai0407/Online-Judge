const express = require('express');
const {authenticateToken,authorizeRoles} = require('../middlewares/auth.js');
const {createTestcase, getTestcases, updateTestcase, deleteTestcase} = require('../controllers/testcaseControllers.js');

const router=express.Router();

router.post('/createTestcases',authenticateToken,authorizeRoles,createTestcase);
router.get('/getTestcases',authenticateToken,getTestcases);
router.put('/updateTestcase',authenticateToken,authorizeRoles,updateTestcase);
router.delete('/deleteTestcases',authenticateToken,authorizeRoles,deleteTestcase);

module.exports = router;