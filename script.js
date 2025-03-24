// Configuration
const SCRAPING_API_ENDPOINT = '/api/scrape-jobs'; // Your backend proxy endpoint

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
        // Construct search parameters
        const searchParams = {
            query: jobTitle,
            location: location,
            excludeRemote: excludeRemote,
            timeFilter: timeFilter
        };

        // Fetch results from scraping proxy
        const response = await fetchScrapedJobResults(searchParams);
        
        // Clear loading message
        resultsContainer.innerHTML = '';

        // Handle no results
        if (response.length === 0) {
            resultsContainer.innerHTML = '<p>No jobs found. Try a different search.</p>';
            return;
        }

        // Render results
        const ul = document.createElement('ul');
        response.forEach(job => {
            const li = document.createElement('li');
            
            const titleEl = document.createElement('h3');
            titleEl.textContent = job.title;
            
            const companyEl = document.createElement('p');
            companyEl.innerHTML = `<strong>Company:</strong> ${job.company}`;
            
            const locationEl = document.createElement('p');
            locationEl.innerHTML = `<strong>Location:</strong> ${job.location}`;
            
            const descriptionEl = document.createElement('p');
            descriptionEl.innerHTML = `<strong>Description:</strong> ${truncateDescription(job.description)}`;
            
            const sourceEl = document.createElement('p');
            sourceEl.innerHTML = `<strong>Source:</strong> ${job.source}`;
            
            const linkEl = document.createElement('a');
            linkEl.href = job.link;
            linkEl.textContent = 'View Original Listing';
            linkEl.target = '_blank';
            linkEl.rel = 'noopener noreferrer';
            
            li.appendChild(titleEl);
            li.appendChild(companyEl);
            li.appendChild(locationEl);
            li.appendChild(descriptionEl);
            li.appendChild(sourceEl);
            li.appendChild(linkEl);
            
            ul.appendChild(li);
        });

        resultsContainer.appendChild(ul);
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error fetching jobs: ${error.message}</p>`;
        console.error('Job search error:', error);
    }
}

// Fetch scraped job results via backend proxy
async function fetchScrapedJobResults(searchParams) {
    try {
        // Multiple search sources for comprehensive results
        const searchQueries = [
            `${searchParams.query} jobs`,
            `${searchParams.query} careers`,
            `"${searchParams.query}" remote jobs`
        ];

        const response = await fetch(SCRAPING_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queries: searchQueries,
                location: searchParams.location,
                excludeRemote: searchParams.excludeRemote
            })
        });

        if (!response.ok) {
            throw new Error('Scraping network response was not ok');
        }

        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error('Scraping error:', error);
        return getMockJobResults(searchParams.query);
    }
}

// Fallback mock results function
function getMockJobResults(jobTitle) {
    return [
        {
            title: `${jobTitle} Position`,
            company: 'Example Company',
            location: 'Remote',
            description: 'We are seeking a talented professional for an exciting opportunity.',
            source: 'Mock Data',
            link: '#'
        }
    ];
}

// Helper function to truncate descriptions
function truncateDescription(description, maxLength = 200) {
    if (!description) return 'No description available';
    return description.length > maxLength 
        ? description.substring(0, maxLength) + '...' 
        : description;
}

// Event Listeners
document.getElementById('jobTitle').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchJobs();
    }
});

// Initialize with default search
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('jobTitle').value = 'Software Engineer';
    searchJobs();
});
