const express = require('express');
const axios = require('axios');
const router = express.Router();

const{createSubmission, getSubmissions, getSubmission, getUserSubmissions, EvaluateSubmission,getUserProblemSubmissions,getMostRecentSubmission} = require('../controllers/submissionController.js');

const {authenticateToken,authorizeRoles}=require('../middlewares/auth');

async function compileAndRunMultiple(req, res, next) {
    try {
        const response = await axios.post('http://localhost:8000/submit', req.body);
        
        req.body.outputs = response.data.outputs;
        req.body.timeTaken = response.data.timeTaken;
        req.body.memoryUsed = response.data.memoryUsed;
        //console.log('done');
        // Pass the modified req object to the next middleware
        next();
    } catch (error) {
        if (error.response && error.response.data) {
            const errorBody = error.response.data;
            console.error('Error from submission service:', errorBody);
            return res.status(500).json({ message: errorBody.error, error: errorBody.stderr });
        } else {
            console.error('Internal Server Error:', error.message);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
}



router.get('/',getSubmissions,authenticateToken,authorizeRoles);
router.post('/',createSubmission,authenticateToken,authorizeRoles);
router.get('/:_id',getUserSubmissions);
router.get('/:_id',getSubmission);
router.post('/submit',authenticateToken,compileAndRunMultiple,EvaluateSubmission);
router.get('/user/:userId/problem/:problemId', authenticateToken, getUserProblemSubmissions);
router.get('/recentSubmission',authenticateToken,getMostRecentSubmission);


module.exports = router;



