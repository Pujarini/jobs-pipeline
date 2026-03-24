const axios = require("axios");

const companies = [
    "stripe",
    "airbnb",
    "discord",
    "notion",
    "figma",
    "datadog",
    "coinbase",
    "rippling",
    "brex",
    "plaid",
    "ramp",
    "gusto",
    "flexport",
    "postman",
    "circleci",
    "sentinelone",
    "tenable",
    "altium",
    "hootsuite"
];

async function fetchGreenhouseJobs(company) {
    try {
        const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs`;
        const res = await axios.get(url);


        return res.data.jobs.map(job => ({
            company,
            title: job.title,
            location: job.location?.name || "N/A",
            url: job.absolute_url,
            updated_at: job.updated_at
        }));
    } catch (e) {
        console.error(`Error fetching ${company}`, e.message);
        return [];
    }
}

async function fetchGreenhouse() {
    const results = await Promise.all(
        companies.map(fetchGreenhouseJobs)
    );

    return results.flat();
}

module.exports = fetchGreenhouse;