import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirInputs = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
    const jobID = uuid();
    const inputFilename = `${jobID}.txt`;
    const inputFilePath = path.join(dirInputs, inputFilename);
    await fs.promises.writeFile(inputFilePath, input);
    return inputFilePath;
};

export default generateInputFile;