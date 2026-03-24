async function fetchMicrosoft() {
    const url =
        "https://apply.careers.microsoft.com/api/pcsx/search?domain=microsoft.com&location=India&sortBy=Relevance&num=50";

    try {
        const res = await fetch(url);
        const data = await res.json();

        const rawJobs = data?.data?.positions || [];

        const jobs = rawJobs.map(job => ({
            title: job.name,
            url: `https://jobs.careers.microsoft.com/global/en${job.positionUrl}`,
            company: "Microsoft",
            location: job.locations?.join(", ") || "",
            postedAt: new Date(job.postedTs * 1000).toISOString() // 🔥 important
        }));


        return jobs;

    } catch (err) {
        console.log("❌ Microsoft fetch error:", err.message);
        return [];
    }
}

module.exports = fetchMicrosoft;