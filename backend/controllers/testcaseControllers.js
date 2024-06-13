const {Testcase} = require('../models/testcases');

class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

// Custom response handling class
class ApiResponse {
    constructor(statusCode, data,message="Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message=message;
        this.success=statusCode<400
    }
}

// Middleware for async error handling
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
};

const createTestcase = async (req, res, next) => {
    //creates a single testcase of a single problem
    try {
        if(!req.user.admin){
            throw new ApiError(403, "You are not authorized to add testcases");
        }
        const {problemId, input, output} = req.body;
        const testcase = await Testcase.create({problemId, input, output});
        return res.status(201).json(new ApiResponse(201, testcase));
    } catch (error) {
        return next(new ApiError(400, error.message));
    }
};

const getTestcases = async (req, res, next) => {
    //finds testcases of a single problem only
    try {
        const problemId = req.query.problemId;
        const testcases = await Testcase.find({problemId: problemId});
        return res.status(200).json(new ApiResponse(200, testcases));
    } catch (error) {
        return next(new ApiError(400, error.message));
    }
};

const fetchTestcases = async (req, res, next) => {
    //finds all testcases of one problem for submission
    //Its a middleware
    try {
        const problemId = req.body.problemId || req.body.problem_id;
        if (problemId === undefined) {
            throw new ApiError(400, "Please provide a problemId");
        }
        const testcases = await Testcase.find({ problemId: problemId });
        req.body.testcases = testcases;
        next();
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, error.message));
    }
}

const deleteTestcase = async (req, res, next) => {
    //deletes a single testcase of a single problem
    try {
        if(!req.user.admin){
            throw new ApiError(403, "You are not authorized to delete testcases");
        }
        const id = req.query.id;
        const testcase = await Testcase.findByIdAndDelete(id);
        return res.status(200).json(new ApiResponse(200, testcase, "Testcase deleted successfully"));
    } catch (error) {
        return next(new ApiError(400, error.message));
    }
};

const deleteAllTestcases = async (req, res, next) => {
    //deletes all testcases of a single problem
    try {
        if(!req.user.admin){
            throw new ApiError(403, "You are not authorized to delete testcases");
        }
        const problemId = req.query.problemId;
        const testcases = await Testcase.deleteMany({problemId: problemId});
        return res.status(200).json(new ApiResponse(200, testcases, "All testcases deleted successfully"));
    } catch (error) {
        return next(new ApiError(400, error.message));
    }
};

const updateTestcase = async (req, res, next) => {
    //updates a single testcase of a single problem
    try {
        if(!req.user.admin){
            throw new ApiError(403, "You are not authorized to update testcases");
        }
        const id = req.query.id;
        const {input, output} = req.body;
        const testcase = await Testcase.findByIdAndUpdate(id, {input, output}, {new: true});
        return res.status(200).json(new ApiResponse(200, testcase, "Testcase updated successfully"));
    } catch (error) {
        return next(new ApiError(400, error.message));
    }
};

module.exports = {createTestcase,updateTestcase,deleteAllTestcases,deleteTestcase,getTestcases,fetchTestcases};


