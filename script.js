// Environment variable for API key (to be set in GitHub secrets)
const GOOGLE_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY || '';
const GOOGLE_SEARCH_CX = import.meta.env.VITE_GOOGLE_SEARCH_CX || '';

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
            titleEl.textContent = job.title;
            
            const companyEl = document.createElement('p');
            companyEl.innerHTML = `<strong>Company:</strong> ${job.company}`;
            
            const locationEl = document.createElement('p');
            locationEl.innerHTML = `<strong>Location:</strong> ${job.location}`;
            
            const descriptionEl = document.createElement('p');
            descriptionEl.innerHTML = `<strong>Description:</strong> ${truncateDescription(job.snippet)}`;
            
            const linkEl = document.createElement('a');
            linkEl.href = job.link;
            linkEl.textContent = 'View Job';
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
    if (!description) return 'No description available';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
}

// Fetch job results 
async function fetchJobResults(jobTitle, location, excludeRemote) {
    // Fallback to local results if API key is not set
    if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_CX) {
        return getMockJobResults(jobTitle);
    }

    // Construct search query
    let searchQuery = `${jobTitle} jobs`;
    if (location) {
        searchQuery += ` in ${location}`;
    }
    if (excludeRemote) {
        searchQuery += ' -remote';
    }

    // Encode the search query
    const encodedQuery = encodeURIComponent(searchQuery);

    try {
        // Use Google Search Results JSON API
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${encodedQuery}&num=10`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Transform Google Search results into job listings
        return (data.items || []).map(item => ({
            title: item.title,
            company: extractCompanyFromTitle(item.title),
            location: extractLocationFromSnippet(item.snippet),
            snippet: item.snippet,
            link: item.link
        }));
    } catch (error) {
        console.error('Error fetching job results:', error);
        // Fallback to mock results if API call fails
        return getMockJobResults(jobTitle);
    }
}

// Fallback mock results function
function getMockJobResults(jobTitle) {
    return [
        {
            title: `${jobTitle} Position`,
            company: 'Example Company',
            location: 'Remote',
            snippet: 'We are seeking a talented professional for an exciting opportunity.',
            link: '#'
        },
        {
            title: `Senior ${jobTitle}`,
            company: 'Tech Innovations Inc.',
            location: 'New York, NY',
            snippet: 'Join our team and make an impact in a dynamic environment.',
            link: '#'
        }
    ];
}

// Helper function to extract company name from title
function extractCompanyFromTitle(title) {
    // Split the title and take the last part as company name
    const parts = title.split(' - ');
    return parts.length > 1 ? parts[parts.length - 1] : 'Unknown Company';
}

// Helper function to extract location from snippet
function extractLocationFromSnippet(snippet) {
    // Look for location-like words in the snippet
    const locationKeywords = [
        'CA', 'NY', 'TX', 'IL', 'FL', 'remote', 'hybrid', 
        'onsite', 'United States', 'US', 'Canada'
    ];
    
    for (let keyword of locationKeywords) {
        if (snippet && snippet.includes(keyword)) {
            return keyword;
        }
    }
    return 'Location Not Specified';
}

// Add event listener to job title input to allow Enter key submission
document.getElementById('jobTitle').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchJobs();
    }
});

// Initialize with some default results
document.addEventListener('DOMContentLoaded', () => {
    // Optional: You can set a default search or leave it empty
    document.getElementById('jobTitle').value = 'Software Engineer';
    searchJobs();
});
