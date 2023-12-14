import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json('Not authenticated');
}

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const openJobs = await Job.find({ status: 'open' });
        const userSavedJobs = await Job.find({ user: req.user.id, status: 'saved' }).select('link');
        const userAppliedJobs = await Job.find({ user: req.user.id, status: 'applied' }).select('link');

        // Convert to sets for efficient lookup
        const savedLinks = new Set(userSavedJobs.map(job => job.link));
        const appliedLinks = new Set(userAppliedJobs.map(job => job.link));

        // Add 'saved' and 'applied' flags to each job
        const jobsWithFlags = openJobs.map(job => {
            return {
                ...job.toObject(),
                is_saved: savedLinks.has(job.link),
                is_applied: appliedLinks.has(job.link)
            };
        });

        res.json(jobsWithFlags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/save', isAuthenticated, async (req, res) => {
    try {
        const openJob = await Job.findOne({ link: req.body.link, status: 'open' });
        if (!openJob) {
            return res.status(404).send('Open job not found');
        }

        const jobData = openJob.toObject({ getters: true, virtuals: false });
        delete jobData._id;  // Remove the original ID
        delete jobData.status;  // Remove the original status

        const savedJob = new Job({
            ...jobData,
            _id: undefined, // Remove the original ID to create a new document
            status: 'saved',
            user: req.user.id
        });

        await savedJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/apply', isAuthenticated, async (req, res) => {
    try {
        const openJob = await Job.findOne({ link: req.body.link, status: 'open' });
        if (!openJob) {
            return res.status(404).send('Open job not found');
        }

        const jobData = openJob.toObject({ getters: true, virtuals: false });
        delete jobData._id;  // Remove the original ID
        delete jobData.status;  // Remove the original status

        const appliedJob = new Job({
            ...jobData,
            _id: undefined, // Remove the original ID to create a new document
            status: 'applied',
            user: req.user.id
        });

        await appliedJob.save();
        res.status(201).json(appliedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Get saved jobs for the logged-in user
router.get('/saved', isAuthenticated, async (req, res) => {
    try {
        const openJobs = await Job.find({ status: 'open' });
        const userSavedJobs = await Job.find({ user: req.user.id, status: 'saved' }).select('link');
        const userAppliedJobs = await Job.find({ user: req.user.id, status: 'applied' }).select('link');

        const savedLinks = new Set(userSavedJobs.map(job => job.link));
        const filteredOpenJobs = openJobs.filter(job => !savedLinks.has(job.link));
        const appliedLinks = new Set(userAppliedJobs.map(job => job.link));

        // Add 'saved' and 'applied' flags to each job
        const jobsWithFlags = filteredOpenJobs.map(job => {
            return {
                ...job.toObject(),
                is_saved: true,
                is_applied: appliedLinks.has(job.link)
            };
        });

        res.json(jobsWithFlags);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get applied jobs for the logged-in user
router.get('/applied', isAuthenticated, async (req, res) => {
    try {
        const openJobs = await Job.find({ status: 'open' });
        const userSavedJobs = await Job.find({ user: req.user.id, status: 'saved' }).select('link');
        const userAppliedJobs = await Job.find({ user: req.user.id, status: 'applied' }).select('link');

        const savedLinks = new Set(userSavedJobs.map(job => job.link));
        const appliedLinks = new Set(userAppliedJobs.map(job => job.link));
        const filteredOpenJobs = openJobs.filter(job => !appliedLinks.has(job.link));

        const jobsWithFlags = filteredOpenJobs.map(job => {
            return {
                ...job.toObject(),
                is_saved: savedLinks.has(job.link),
                is_applied: true
            };
        });

        res.json(jobsWithFlags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;
