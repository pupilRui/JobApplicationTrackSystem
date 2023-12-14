// JobList.js
import React from 'react';
import JobItem from './JobItem';

const JobList = ({ jobs }) => {
    return (
        <div>
            <h2>All Jobs</h2>
            {jobs.map(job => (
                <JobItem key={job._id} job={job} />
            ))}
        </div>
    );
};

export default JobList;
