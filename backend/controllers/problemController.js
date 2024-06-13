const {Problem}= require('../models/problems');

// Custom error handling class
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

const createProblem = asyncHandler(async (req, res, next) => {
    if (!req.user.admin) {
        throw new ApiError(403, "You are not authorized to add problems");
    }
    const { name, statement, constraints, testcases, tag, timeLimit, memoryLimit } = req.body;
    const problem = await Problem.create({
        name,
        statement,
        constraints,
        testcases,
        tag,
        timeLimit,
        memoryLimit
    });
    return res.status(201).json(new ApiResponse(201, problem));
});

const updateProblem = asyncHandler(async (req, res, next) => {
    if (!req.user.admin) {
        throw new ApiError(403, "You are not authorized to update tasks");
    }
    const { _id } = req.params;
    const { name, statement, constraints, testcases, tag, memoryLimit, timeLimit } = req.body;
    const problem = await Problem.findByIdAndUpdate(_id, {
        name,
        statement,
        constraints,
        testcases,
        tag,
        memoryLimit,
        timeLimit
    }, { new: true }); // Return the updated document
    return res.status(200).json(new ApiResponse(200, problem));
});

const deleteProblem = asyncHandler(async (req, res, next) => {
    if (!req.user.admin) {
        throw new ApiError(403, "You are not authorized to delete problems");
    }
    const { _id } = req.params;
    const problem = await Problem.findByIdAndDelete(_id);
    return res.status(200).json(new ApiResponse(200, problem));
});

const getProblem = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const problem = await Problem.findById(_id);
    if(!problem){
        console.log("No such problem exists!");
    }
    return res.status(200).json(new ApiResponse(200, problem));
});

const getAllProblems = asyncHandler(async (req, res, next) => {
    const problems = await Problem.find({});
    return res.status(200).json(new ApiResponse(200, problems));
});

const getConstraints= async (req, res, next) => {
    try {
        const problemId= req.body.problemId || req.body.problem_id;
        const problem = await Problem.findById(problemId);
        req.body.timeLimit = problem.timeLimit;
        req.body.memoryLimit = problem.memoryLimit;
    }
    catch (error) {
        return res.status(400).json(new ApiResponse(400, error.message));
    }
}

const getProblemtestcases= async (req, res, next) => {
    try {
    const { _id } = req.params;
    const problem = await Problem.findById(_id);
    if(!problem){
        console.log("No such problem exists!");
    }
        return res.status(200).json(new ApiResponse(200, problem.testcases));
    }
    catch (error) {
        return res.status(400).json(new ApiResponse(400, error.message));
    }
}




module.exports = { createProblem, updateProblem, deleteProblem, getProblem, getAllProblems,getProblemtestcases, getConstraints};
