const {Schema} = require('mongoose');
const mongoose = require('mongoose');


const testcaseSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },
    input: {
        type: [String],
        required: true
    },
    output: {
        type: [String],
        required: true
    }
}
);

const Testcase = mongoose.model("Testcase", testcaseSchema);
module.exports = {Testcase};