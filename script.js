// Replace with your actual RapidAPI key
const RAPID_API_KEY = 'YOUR_RAPIDAPI_KEY';

async function searchJobs() {
    const jobTitle = document.getElementById('jobTitle').value || '';
    const timeFilter = document.getElementById('timeFilter').value;
    const excludeRemote = document.getElementById('excludeRemote').checked;
    const location = document.getElementById('locationSelect').value;

    const displayTitle = document.getElementById('displayTitle');
    const resultsContainer = document.getElementById('results');

    // Clear previous results and show loading
    resultsContainer.innerHTML = '<p>Searching for jobs...</p>';
    displayTitle.textContent = `Jobs for "${jobTitle}" - Past ${timeFilter === '24hours' ? '24 Hours' : timeFilter}`;

    try {
        const response = await fetchJobResults(jobTitle, location, excludeRemote);
        
        // Clear loading message
        resultsContainer.innerHTML = '';

        // Create results list
        if (response.length === 0) {
            resultsContainer.innerHTML = '<p>No jobs found. Try a different search.</p>';
            return;
        }

        const ul = document.createElement('ul');
        response.forEach(job => {
            const li = document.createElement('li');
            
            const titleEl = document.createElement('h3');
            titleEl.textContent = job.job_title || 'Untitled Position';
            
            const companyEl = document.createElement('p');
            companyEl.innerHTML = `<strong>Company:</strong> ${job.employer_name || 'Not Specified'}`;
            
            const locationEl = document.createElement('p');
            locationEl.innerHTML = `<strong>Location:</strong> ${job.job_city || job.job_state || 'Not Specified'}`;
            
            const descriptionEl = document.createElement('p');
            descriptionEl.innerHTML = `<strong>Description:</strong> ${truncateDescription(job.job_description || 'No description available')}`;
            
            const linkEl = document.createElement('a');
            linkEl.href = job.job_apply_link || job.job_url || '#';
            linkEl.textContent = 'Apply Now';
            linkEl.target = '_blank';
            linkEl.rel = 'noopener noreferrer';
            
            li.appendChild(titleEl);
            li.appendChild(companyEl);
            li.appendChild(locationEl);
            li.appendChild(descriptionEl);
            li.appendChild(linkEl);
            
            ul.appendChild(li);
        });

        resultsContainer.appendChild(ul);
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error fetching jobs: ${error.message}</p>`;
        console.error('Job search error:', error);
    }
}

// Helper function to truncate long descriptions
function truncateDescription(description, maxLength = 200) {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
}

// Fetch job results using JSearch API
async function fetchJobResults(jobTitle, location, excludeRemote) {
    // Construct query parameters
    const query = {
        query: jobTitle,
        page: '1',
        num_pages: '5'
    };

    // Add location if specified
    if (location) {
        query.location = location;
    }

    // Handle remote job filtering
    if (excludeRemote) {
        query.remote_jobs = 'false';
    }

    const url = 'https://jsearch.p.rapidapi.com/search';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        },
        params: query
    };

    try {
        const response = await fetch(`${url}?${new URLSearchParams(query)}`, options);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Return the data or an empty array if no jobs found
        return data.data || [];
    } catch (error) {
        console.error('Error fetching job results:', error);
        throw error;
    }
}

// Add event listener to job title input to allow Enter key submission
document.getElementById('jobTitle').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchJobs();
    }
});

// Optional: Initialize with some default results
document.addEventListener('DOMContentLoaded', () => {
    // Optional: You can set a default search or leave it empty
    document.getElementById('jobTitle').value = 'Software Engineer';
    searchJobs();
});
