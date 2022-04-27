const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const jobSchema = new Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: [50, "Company name can't be more than 50 characters"]
    },
    position: {
        type: String,
        required: [true, "Please provide Position"],
        maxlength: [100, "Position can't be more than 50 characters"]
    },
    status: {
        type: String,
        enum: [
            'interview',
            'declined',
            'pending'
        ],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    }
}, { timestamps: true })

const Job = mongoose.model('job', jobSchema)

module.exports = Job;

