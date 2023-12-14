import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Authentication from './Authentication';
import JobList from './JobList';
import SavedJobs from './SavedJobs';
import AppliedJobs from './AppliedJobs';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetch('http://localhost:8080/jobs', {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => {
                    if (response.status === 401) {
                        throw new Error('Unauthorized - Please log in to view jobs');
                    }
                    return response.json();
                })
                .then(data => setJobs(data))
                .catch(error => console.error('Error fetching jobs:', error));
        }
    }, [isAuthenticated]);

    return (
        <Router>
            <div className="App">
                <Authentication 
                    isAuthenticated={isAuthenticated} 
                    setIsAuthenticated={setIsAuthenticated}
                />

                <h1>Welcome to the Job Tracker</h1>

                {isAuthenticated && (
                    <nav>
                        <Link to="/">Job List</Link>
                        <Link to="/saved-jobs">Saved Jobs</Link>
                        <Link to="/applied-jobs">Applied Jobs</Link>
                    </nav>
                )}

                <Routes>
                    <Route path="/" element={isAuthenticated ? <JobList jobs={jobs} /> : <div>Please log in</div>} />
                    <Route path="/saved-jobs" element={isAuthenticated ? <SavedJobs /> : <div>Please log in</div>} />
                    <Route path="/applied-jobs" element={isAuthenticated ? <AppliedJobs /> : <div>Please log in</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
