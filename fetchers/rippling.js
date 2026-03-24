const axios = require("axios");

async function getBuildId() {
    const res = await axios.get("https://www.rippling.com/careers/open-roles");

    const match = res.data.match(/"buildId":"(.*?)"/);
    return match ? match[1] : null;
}

async function fetchRippling() {
    try {
        const buildId = await getBuildId();

        if (!buildId) {
            console.error("Rippling: buildId not found");
            return [];
        }

        const url = `https://www.rippling.com/_next/data/${buildId}/en-US/careers/open-roles.json`;

        const res = await axios.get(url);

        const jobs = res.data?.pageProps?.jobs?.items || [];

        console.log(`Rippling: ${jobs.length} jobs`);

        return jobs
            .filter(job => {
                const title = (job.name || "").toLowerCase();
                return (
                    title.includes("engineer") ||
                    title.includes("developer")
                );
            })
            .map(job => ({
                company: "Rippling",
                title: job.name,
                location: job.locations?.map(l => l.name).join(", ") || "N/A",
                url: job.url,
                postedAt: new Date()
            }));

    } catch (e) {
        console.error("Error fetching Rippling", e.message);
        return [];
    }
}

module.exports = fetchRippling;