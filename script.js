async function searchJobs() {
    const jobTitle = document.getElementById('jobTitle').value || '';
    const timeFilter = document.getElementById('timeFilter').value;
    const excludeRemote = document.getElementById('excludeRemote').checked;
    const location = document.getElementById('locationSelect').value;

    const displayTitle = document.getElementById('displayTitle');
    const resultsContainer = document.getElementById('results');

    // Clear previous results
    resultsContainer.innerHTML = '';
    displayTitle.textContent = `Jobs for "${jobTitle}" - Past ${timeFilter === '24hours' ? '24 Hours' : timeFilter}`;

    try {
        // This would typically be replaced with an actual API call
        const response = await fetchJobResults(jobTitle, timeFilter, excludeRemote, location);
        
        // Create results list
        const ul = document.createElement('ul');
        response.forEach(job => {
            const li = document.createElement('li');
            
            const titleEl = document.createElement('h3');
            titleEl.textContent = job.title;
            
            const companyEl = document.createElement('p');
            companyEl.textContent = `Company: ${job.company}`;
            
            const descriptionEl = document.createElement('p');
            descriptionEl.textContent = job.description;
            
            const linkEl = document.createElement('a');
            linkEl.href = job.url;
            linkEl.textContent = 'View Job';
            linkEl.target = '_blank';
            linkEl.rel = 'noopener noreferrer';
            
            li.appendChild(titleEl);
            li.appendChild(companyEl);
            li.appendChild(descriptionEl);
            li.appendChild(linkEl);
            
            ul.appendChild(li);
        });

        resultsContainer.appendChild(ul);
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error fetching jobs: ${error.message}</p>`;
    }
}

// Mock function to simulate job search API
async function fetchJobResults(jobTitle, timeFilter, excludeRemote, location) {
    // This is a mock implementation. In a real-world scenario, 
    // this would be replaced with an actual API call
    return [
        {
            title: 'Software Engineer',
            company: 'Tech Innovations Inc.',
            description: 'We are seeking a talented Software Engineer to join our dynamic team...',
            url: 'https://example.com/job/software-engineer'
        },
        {
            title: 'Product Manager',
            company: 'Digital Solutions Corp',
            description: 'Looking for an experienced Product Manager to lead our product strategy...',
            url: 'https://example.com/job/product-manager'
        },
        {
            title: 'Data Analyst',
            company: 'Data Insights LLC',
            description: 'We need a detail-oriented Data Analyst to help us drive business decisions...',
            url: 'https://example.com/job/data-analyst'
        }
    ];
}

// Add event listener to job title input to allow Enter key submission
document.getElementById('jobTitle').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchJobs();
    }
});

// Optional: Initialize with some default results
document.addEventListener('DOMContentLoaded', searchJobs);
