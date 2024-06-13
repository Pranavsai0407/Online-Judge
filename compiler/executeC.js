import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split('.')[0];
  const outPath = path.join(outputPath, `${jobId}.o`);

  return new Promise((resolve, reject) => {
    
    exec(
      `gcc "${filepath}" -o "${outPath}" && cd "${outputPath}" && ./"${jobId}.o" < "${inputPath}"`,
      (error, stdout, stderr) => {
        const endTime = process.hrtime(startTime); // End time
        const timeUsed = endTime[0] + endTime[1] / 1e9; // Convert to seconds
        const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024; // Convert to megabytes

        if (error) {
          reject({ error, stderr });
        } else {
          resolve({ stdout, timeUsed, memoryUsed });
        }
      }
    );
  });
};

export default executeC;