import React, { useState } from 'react';

const JobItem = ({ job }) => {
    const [isSaved, setIsSaved] = useState(job.is_saved);
    const [isApplied, setIsApplied] = useState(job.is_applied);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSaveJob = async () => {
        try {
            const response = await fetch('http://localhost:8080/jobs/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ link: job.link }),
                credentials: 'include' // Include credentials for authentication
            });

            if (response.ok) {
                setIsSaved(true);
            } else {
                // Handle errors
                console.error('Failed to save job');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleApplyJob = async () => {
        try {
            const response = await fetch('http://localhost:8080/jobs/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ link: job.link }),
                credentials: 'include' // Include credentials for authentication
            });

            if (response.ok) {
                setIsApplied(true);
            } else {
                // Handle errors
                console.error('Failed to apply for job');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="job-item">
            <h3>{job.job}</h3>
            <div className="job-meta" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Company: {job.company}</p>
                <p>Date Posted: {formatDate(job.date)}</p>
                <p>Location: {job.nation}</p>
                <p>Type: {job.type}</p>
                <p>Target Group: {job.target_group}</p>
                <p>Status: {job.status}</p>
            </div>
            <div>
                <a href={job.link} target="_blank" rel="noopener noreferrer">View Job</a>
            </div>
            <div>
                {isSaved ? <p>Job Saved</p> : <button onClick={handleSaveJob}>Save Job</button>}
                {isApplied ? <p>Already Applied</p> : <button onClick={handleApplyJob}>Apply</button>}
            </div>
        </div>
    );

};

export default JobItem;
