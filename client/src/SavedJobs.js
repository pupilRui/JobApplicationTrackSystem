import React, { useEffect, useState } from 'react';
import JobItem from './JobItem'; // Import JobItem component
import { Link } from 'react-router-dom';

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Fetch saved jobs from the server
        fetch('http://localhost:8080/jobs/saved', { credentials: 'include' })
            .then(response => response.json())
            .then(data => setJobs(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h2>Saved Jobs</h2>
            {jobs.map(job => (
                <JobItem key={job.id} job={job} /> // Use JobItem to render each job
            ))}
            <div>
                <Link to="/"><button>All Jobs</button></Link>
                <Link to="/applied-jobs"><button>Applied Jobs</button></Link>
            </div>
        </div>
    );
};

export default SavedJobs;
