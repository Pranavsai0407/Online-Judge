const fs=require('fs');
const path=require('path');
const {v4:uuid}=require('uuid');

const dirinputs= path.join(__dirname,'inputs');

if(!fs.existsSync(dirinputs)){
    fs.mkdirSync(dirinputs,{recursive:true});
}
const generateInputFile= async (input)=>{
    const uniqID=uuid();
    const filename=`${uniqID}.txt`;
    const filePath=path.join(dirinputs,filename);
    await fs.writeFileSync(filePath,input);
    return filePath;
};

module.exports={generateInputFile};