// Mock data for demonstration
const jobSources = [
    { name: 'Greenhouse', url: 'https://www.google.com/search?q="Business%20Operations"+site:greenhouse.io+remote&tbs=qdr:d' },
    { name: 'Lever', url: 'https://www.google.com/search?q="Business%20Operations"+site:lever.co+remote&tbs=qdr:d' },
    { name: 'Ashby', url: 'https://www.google.com/search?q="Business%20Operations"+site:ashbyhq.com+remote&tbs=qdr:d' },
    { name: 'Remote Rocketship', url: 'https://remoterocketship.com/?ref=freshjobs&jobTitle=Business%20Operations' },
    // Add more sources as needed
];

function generateList() {
    const jobTitle = document.getElementById('jobTitle').value || 'Business Operations';
    const timeFilter = document.getElementById('timeFilter').value;
    const excludeRemote = document.getElementById('excludeRemote').checked;
    const location = document.getElementById('locationSelect').value;

    const displayTitle = document.getElementById('displayTitle');
    const resultsContainer = document.getElementById('results');

    // Update display title
    displayTitle.textContent = `${jobTitle} - Past ${timeFilter === '24hours' ? '24 Hours' : timeFilter}`;

    // Clear previous results
    resultsContainer.innerHTML = `<h3>${jobTitle} - Past ${timeFilter === '24hours' ? '24 Hours' : timeFilter}</h3>`;

    // Create results list
    const ul = document.createElement('ul');
    jobSources.forEach((source, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${source.name.toLowerCase().replace(/\s+/g, '-')}-${jobTitle.replace(/\s+/g, '-')}`;
        checkbox.name = checkbox.id;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;

        const link = document.createElement('a');
        link.href = source.url;
        link.textContent = source.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        label.appendChild(link);
        li.appendChild(checkbox);
        li.appendChild(label);
        ul.appendChild(li);
    });

    resultsContainer.appendChild(ul);
}

// Optional: Add event listener to job title input to allow Enter key submission
document.getElementById('jobTitle').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        generateList();
    }
});

// Initialize with default search on page load
document.addEventListener('DOMContentLoaded', generateList);
