import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (language, content) => {
    const jobID = uuid();
    let format;
    let filename;
    switch (language) {
        case 'c':
            format = 'c';
            filename = `${jobID}.${format}`;
            break;
        case 'java':
            format = 'java';
            filename = `${jobID}.${format}`;
            break;
        case 'python':
            format = 'py';
            filename = `${jobID}.${format}`;
            break;
        default:
            format = 'cpp';
            filename = `${jobID}.${format}`;
            break;
    }
    const filePath = path.join(dirCodes, filename);
    await fs.promises.writeFile(filePath, content);
    return filePath;
};

export default generateFile;