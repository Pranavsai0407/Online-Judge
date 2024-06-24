import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { promisify } from 'util';

import generateFile from './generateFile.js';
import generateInputFile from './generateInputFile.js';

import executeCpp from './executeCpp.js';
import executeC from './executeC.js';
import executeJava from './executeJava.js';
import executePython from './executePython.js';

const app = express();
app.use(cors({
    origin: 'https://frontend.algorithmicjudge.online', // Update with your frontend URL
    //origin: `http://localhost:5173`,
    credentials: true, // Allow credentials (cookies, headers)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8000;

const unlinkAsync = promisify(fs.unlink);

app.get('/', (req, res) => {
    res.send('Hello Compiler!');
});

app.post('/run', async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
  
    if (!code) {
        return res.status(400).json({ success: false, error: 'Empty code!' });
    }

    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);

    try {
        let output;
        switch (language) {
            case 'c':
                output = await executeC(filePath, inputPath);
                break;
            case 'java':
                output = await executeJava(filePath, inputPath);
                break;
            case 'python':
                output = await executePython(filePath, inputPath);
                break;
            default:
                output = await executeCpp(filePath, inputPath);
                break;
        }
        res.json({ output });
    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        try {
            await unlinkAsync(filePath);
            await unlinkAsync(inputPath);
        } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
        }
    }
});

app.post('/submit', async (req, res) => {
    const { language, code, testcases, timeLimit, memoryLimit } = req.body;
  
    const filePath = await generateFile(language, code);
    let outputs = [];
    let timeTaken = 0;
    let memoryUsed = 0;
    try {
      for (let testcase of testcases) {
        const inputPath = await generateInputFile(testcase.input.join('\n'));
        let output, time = 0, memory = 0, stderr;
        switch (language) {
          case 'c':
            const { stderr: cStderr, stdout: cStdout, memoryUsed: cMemoryUsed, timeUsed: cTimeUsed } = await executeC(filePath, inputPath);
            output = cStdout;
            time = cTimeUsed;
            memory = cMemoryUsed;
            stderr = cStderr;
            break;
          case 'java':
            const { stderr: javaStderr, stdout: javaStdout, memoryUsed: javaMemoryUsed, timeUsed: javaTimeUsed } = await executeJava(filePath, inputPath);
            output = javaStdout;
            time = javaTimeUsed;
            memory = javaMemoryUsed;
            stderr = javaStderr;
            break;
          case 'python':
            const { stderr: pythonStderr, stdout: pythonStdout, memoryUsed: pythonMemoryUsed, timeUsed: pythonTimeUsed } = await executePython(filePath, inputPath);
            output = pythonStdout;
            time = pythonTimeUsed;
            memory = pythonMemoryUsed;
            stderr = pythonStderr;
            break;
          default:
            const { stderr: cppStderr, stdout: cppStdout, memoryUsed: cppMemoryUsed, timeUsed: cppTimeUsed } = await executeCpp(filePath, inputPath);
            output = cppStdout;
            time = cppTimeUsed;
            memory = cppMemoryUsed;
            stderr = cppStderr;
            break;
        }
  
        timeTaken = Math.max(timeTaken, time);
        memoryUsed = Math.max(memoryUsed, memory);
        outputs.push(output.trim());
  
        // Delete the input file after it's processed
        await unlinkAsync(inputPath);
      }
      //After change ******************************************************************
  
      const verdict = (timeTaken > parseFloat(timeLimit) * 1000) ? 'Time Limit Exceeded' :
                      (memoryUsed > parseInt(memoryLimit) * 1024) ? 'Memory Limit Exceeded' :
                      outputs.every((output, index) => output === testcases[index].output.join('\n')) ? 'Accepted' : 'Wrong Answer';
  
      res.status(200).json({ outputs, timeTaken, memoryUsed, verdict });
    } catch (error) {
      // If an error occurs, send it as a response
      res.status(500).json({ success: false, error: error.message, stderr: stderr });
    } finally {
      // Ensure the code file is deleted after processing
      try {
        await unlinkAsync(filePath);
      } catch (cleanupError) {
        console.error('Error deleting file:', cleanupError);
      }
    }
  });
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
