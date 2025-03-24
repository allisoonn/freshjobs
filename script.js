const jobs = [
    { title: "Software Engineer", company: "Google", source: "LinkedIn", date: "2025-03-20" },
    { title: "Data Analyst", company: "Amazon", source: "Indeed", date: "2025-03-18" },
    { title: "Product Manager", company: "Facebook", source: "Glassdoor", date: "2025-03-22" },
    { title: "UX Designer", company: "Apple", source: "LinkedIn", date: "2025-03-15" }
];
document.getElementById("searchButton").addEventListener("click", function() {
    generateList(); // This should be your function that processes the search
});
function displayJobs(filteredJobs) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = ""; 

    filteredJobs.forEach(job => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${job.title}</strong> - ${job.company} <br> <em>${job.source}</em> | ${job.date}`;
        jobList.appendChild(li);
    });
}

function filterJobs() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let sourceFilter = document.getElementById("sourceFilter").value;

    let filteredJobs = jobs.filter(job => 
        (job.title.toLowerCase().includes(searchInput) || 
        job.company.toLowerCase().includes(searchInput)) &&
        (sourceFilter === "all" || job.source === sourceFilter)
    );

    displayJobs(filteredJobs);
}

function sortJobs() {
    let sortBy = document.getElementById("sortSelect").value;
    let sortedJobs = [...jobs];

    if (sortBy === "date") {
        sortedJobs.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "title") {
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "company") {
        sortedJobs.sort((a, b) => a.company.localeCompare(b.company));
    }

    displayJobs(sortedJobs);
}
function generateList() {
    alert("Search button clicked! Implement job search logic here.");
}
// Initial display
displayJobs(jobs);
