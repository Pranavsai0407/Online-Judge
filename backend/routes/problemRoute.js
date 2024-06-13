const express = require('express');
//const router = express.Router();

//const deleteAllTestcases = require('../controllers/testcaseControllers');
const { createProblem, updateProblem, deleteProblem, getProblem, getAllProblems, getProblemtestcases } = require('../controllers/problemController');
const router = express.Router();
const {authenticateToken,authorizeRoles}=require('../middlewares/auth');
const {deleteAllTestcases} = require('../controllers/testcaseControllers');

router.post('/create',authenticateToken,authorizeRoles, createProblem);
router.put('/update/:_id',authenticateToken,authorizeRoles, updateProblem);
router.delete('/delete/:_id',authenticateToken,authorizeRoles, deleteProblem,deleteAllTestcases);
router.get('/getProblem/:_id',authenticateToken, getProblem);
router.get('/getProblemtestcases/:_id',authenticateToken, getProblemtestcases);
router.get('/getAllProblems',authenticateToken, getAllProblems);
//router.delete('/deleteAlltestcases/:_id',authenticateToken,authorizeRoles('admin'),deleteAllTestcases);


module.exports = router;
