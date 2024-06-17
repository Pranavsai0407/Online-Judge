const {Submission}= require('../models/submissions');


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

const createSubmission = async (req, res, next) => {
  try {
    const { userId, language, code, verdict, problemId, timeTaken, memoryUsed } = req.body;
    //console.log(userId);
    const submissionData = {
      userId,
      language,
      code,
      verdict,
      problemId,
      execTime:timeTaken,
      memory:memoryUsed,
      submissionTime: new Date()
    };

    const submission = await Submission.create(submissionData);

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

const getSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find();
        return res.status(200).json(new ApiResponse(200, submissions));
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, error.message));
    }
}

const getSubmission = async (req, res, next) => {
    try {
        const submission = await Submission.findById(req.params.id);
        return res.status(200).json(new ApiResponse(200, submission));
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, error.message));
    }
}

const getUserSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find({user: req.params.id});
        return res.status(200).json(new ApiResponse(200, submissions));
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, error.message));
    }
}

const getUserProblemSubmissions = async (req, res, next) => {
  try {
    const { userId, _id } = req.params;
    const submissions = await Submission.find({ userId: userId, problemId:_id });
    
    //console.log(userId,_id);
    
    return res.status(200).json({ data: submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

const getMostRecentSubmission = async (req, res) => {
    //console.log('okkk');
    try {
      const userId = req.user._id;
      const mostRecentSubmission = await Submission.findOne({ userId: userId })
        .sort({ submissionTime: -1 })
        .select('-userId -taskId -__v')
        .lean();
  
      if (!mostRecentSubmission) {
        return res.status(404).json({
          success: false,
          message: 'No submissions found for the user.'
        });
      }
  
      console.log("Most recent submission:", mostRecentSubmission); // Add this line for debugging
  
      return res.status(200).json({
        success: true,
        data: {
          submission: mostRecentSubmission,
          username: req.user.username
        }
      });
    } catch (error) {
      console.error("Error fetching most recent submission:", error); // Log the error
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  

const EvaluateSubmission = asyncHandler(async (req, res, next) => {
    try {
      const { testcases, outputs, language, code, problemId, problem_id, timeTaken, memoryUsed, timeLimit, memoryLimit } = req.body;
  
      // Check if required fields are present
      if (!testcases || !outputs || !language || !code || !(problemId || problem_id) || timeTaken == null || memoryUsed == null || timeLimit == null || memoryLimit == null) {
        return res.status(400).json(new ApiResponse(400, "Missing required fields"));
      }
  
      const expectedOutputs = testcases.map(testcase => testcase.output.toString().trim());
      const problemIdValue = problemId || problem_id;
  
      let submissionData = {
        user: req.user._id,  // Assuming req.user has the user details
        language,
        code,
        problemId: problemIdValue,
        timeTaken,
        memoryUsed,
        verdict: '',
        execTime: timeTaken,
        memory: memoryUsed,
        submissionTime: new Date(),
      };

      // Convert limits and usage to numbers for accurate comparison
      const parsedTimeLimit = parseFloat(timeLimit);
      const parsedMemoryLimit = parseFloat(memoryLimit);
  
      const usedTime = parseFloat(timeTaken);
      const usedMemory = parseFloat(memoryUsed);
      
      submissionData.execTime=usedTime;
      submissionData.memory=usedMemory;
  

      for (let i = 0; i < expectedOutputs.length; i++) {
        if (outputs[i].toString().trim() !== expectedOutputs[i]) {
          submissionData.verdict = `Wrong Answer on testcase ${i + 1}`;
          await createSubmission(submissionData);
          return res.status(200).json(new ApiResponse(200, { status: "Wrong Answer", testcase: i + 1 }));
        }
      }
  
      
  
      if (usedTime > parsedTimeLimit) {
        console.log(usedTime);
        console.log(parsedTimeLimit);
        submissionData.verdict = "Time Limit Exceeded";
      } else if (usedMemory > parsedMemoryLimit) {
        console.log(usedMemory);
        console.log(parsedMemoryLimit);
        submissionData.verdict = "Memory Limit Exceeded";
      } else {
        submissionData.verdict = "Accepted";
      }

      
      await createSubmission(submissionData);
      console.log('evaluated');
      return res.status(200).json(new ApiResponse(200, { status: submissionData.verdict }));
    } catch (error) {
      console.log('fail', error);
      return res.status(400).json(new ApiResponse(400, error.message));
    }
  });
  
const getUserData = asyncHandler(async (req, res) => {
    
    let profile = JSON.parse(JSON.stringify(req.user));
    const uniqueProblemsSolved = await Submission.distinct('problemId', { userId: req.user._id, verdict: "Accepted" });
    profile.problemsSolved = uniqueProblemsSolved.length;

    const submissions = await Submission.distinct('problemId', { userId: req.user._id });

    profile.problemsAttempted = submissions.length;

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            profile,
            "Profile data fetched successfully"
        ))
})

module.exports={createSubmission, getSubmissions, getSubmission, getUserSubmissions, EvaluateSubmission,getUserProblemSubmissions,getUserData,getMostRecentSubmission};