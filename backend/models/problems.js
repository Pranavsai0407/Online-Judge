
const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const problemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Problem name is required"],
        trim: true
    },
    statement:{
        type: String,
        required: [true, "Problem statement is required"],
        trim: true
    },
    constraints: {
        type: [String],
        required: [true, "Problem constraints are required"],
    },

    testcases: {
        type: [Schema.Types.Mixed],
        default: []
    },
    tag: {
        type: [String],
        default: []
    },
    timeLimit: {
        type: String,
        default: "1s"
    },
    memoryLimit: {
        type: String,
        default: "256 MB"
    },
}, {timestamps: true}
);

const Problem = mongoose.model("Problem", problemSchema);

module.exports = {Problem};
