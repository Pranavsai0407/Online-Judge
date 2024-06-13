const {generateFile} =require('./generateFile');
const {generateInputFile} =require('./generateInputFile');
const { executeCpp ,executeCpp2} = require('./executeCpp');
const { executeC ,executeC2} = require('./executeC');
const { executepy } = require('./executepy');
const fs = require("fs");
const path = require("path");
exports.b = async (req, res) => {
  res.send("Hello,world! b");
};
exports.run=async(req,res)=>{
    const {language="cpp",code,input}=req.body;
    const outputPath = path.join(__dirname, "outputs");
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    if(code===undefined){
        return res.status(400).json({success:false,error:"Empty Code body"});
    }
    try{
        const filePath= await generateFile(language,code);
        const InputFilePath= await generateInputFile(input);
        const uniqID = path.basename(filePath).split(".")[0];
        const outPath = path.join(outputPath, `${uniqID}.exe`);
        if(language==="cpp"){
            const output=await executeCpp(filePath,InputFilePath,outPath);
            res.json({filePath,InputFilePath,output,outPath});
        }
        else if(language==="c"){
            const output=await executeC(filePath,InputFilePath,outPath);
            res.json({filePath,InputFilePath,output,outPath});
        }
        else if(language==="py"){
            const output=await executepy(filePath,InputFilePath);
            res.json({filePath,InputFilePath,output,outPath});
        }
    } 
    catch (error) {
        res.status(400).json({success:false, error: {message: "error running code in compiler controller ",error:error}});
    }
}
exports.submit=async (req,res)=>{
    const{language="cpp",input,outPath}=req.body;
    const InputFilePath= await generateInputFile(input);
    if(!outPath){
        return res.status(400).json({success:false,error:"No output Path given while submitting"});
    }
    try {
        if(language==="cpp"){
            const output=await executeCpp2(InputFilePath,outPath);
            res.json({InputFilePath,output});
        }
        else if(language==="c"){
            const output=await executeC2(InputFilePath,outPath);
            res.json({InputFilePath,output});
        }
        else if(language==="py"){
            const output=await executepy(filePath,InputFilePath,outPath);
            res.json({filePath,InputFilePath,output,outPath});
        }
    } catch (error) {
        res.status(400).json({success:false, error: {message: "error submitting code in compiler controller ",error:error}});

    }
    
}