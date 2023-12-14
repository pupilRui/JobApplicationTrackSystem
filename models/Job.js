import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'saved', 'applied'],
        default: 'open'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    job: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    nation: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    target_group: {
        type: String,
        required: false
    },
    job_feedback: [{
        type: mongoose.Schema.Types.Mixed // Assuming feedback can be of various types
    }]
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
