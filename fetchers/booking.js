const axios = require("axios");

async function fetchBooking() {
    try {
        const baseUrl = `https://www.bookingholdings-coe.com/api/jobs?locations=Bangalore,Karnataka,India&categories=Engineering&sortBy=relevance&descending=false&internal=false`;

        let allJobs = [];

        // 🔹 Step 1: First request to get count
        const firstRes = await axios.get(`${baseUrl}&page=1`);

        const totalJobs = firstRes.data?.count || 0;
        const pageSize = firstRes.data?.filter?.displayLimit || 10;

        const totalPages = Math.ceil(totalJobs / pageSize);

        console.log(`Booking: ${totalJobs} jobs, ${totalPages} pages`);

        // 🔹 Step 2: Parse first page
        const firstJobs = firstRes.data?.jobs || [];

        allJobs.push(
            ...firstJobs.map(j => parseJob(j))
        );

        // 🔹 Step 3: Fetch remaining pages
        const promises = [];

        for (let page = 2; page <= totalPages; page++) {
            promises.push(
                axios.get(`${baseUrl}&page=${page}`)
            );
        }

        const responses = await Promise.all(promises);

        responses.forEach(res => {
            const jobs = res.data?.jobs || [];
            allJobs.push(...jobs.map(j => parseJob(j)));
        });

        return allJobs;

    } catch (e) {
        console.error("Error fetching Booking.com", e.message);
        return [];
    }
}

// 🔹 Extract job safely
function parseJob(j) {
    const job = j.data;

    return {
        company: "Booking.com",
        title: job.title,
        location: job.full_location || `${job.city}, ${job.country}`,
        url: job.apply_url,
        postedAt: job.posted_date || job.create_date,
        department: { name: job.category?.[0] || "Engineering" }
    };
}

module.exports = fetchBooking;