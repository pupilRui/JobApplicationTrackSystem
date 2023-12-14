import React, { useEffect, useState } from 'react';
import JobItem from './JobItem'; // Import JobItem component
import { Link } from 'react-router-dom';

const AppliedJobs = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Fetch applied jobs from the server
        fetch('http://localhost:8080/jobs/applied', { credentials: 'include' })
            .then(response => response.json())
            .then(data => setJobs(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h2>Applie Jobs</h2>
            {jobs.map(job => (
                <JobItem key={job.id} job={job} /> // Use JobItem to render each job
            ))}
            <div>
                <Link to="/"><button>All Jobs</button></Link>
                <Link to="/saved-jobs"><button>Saved Jobs</button></Link>
            </div>
        </div>
    );
};

export default AppliedJobs;
