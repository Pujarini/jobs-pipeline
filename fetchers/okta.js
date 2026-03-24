const puppeteer = require("puppeteer");

async function fetchOkta() {
    const url =
        "https://www.okta.com/company/careers/job-listing/?keywords=UI&department=4183&location=5997";

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });

        // give page extra time to render
        await new Promise(resolve => setTimeout(resolve, 3000));

        const jobs = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll("a"));

            return links
                .map(el => ({
                    title: el.innerText.trim(),
                    url: el.href
                }))
                .filter(job =>
                    job.title &&
                    job.url &&
                    job.title.toLowerCase().includes("engineer")
                );
        });

        const enrichedJobs = [];


        for (const job of jobs) {
            try {
                await page.goto(job.url, { waitUntil: "domcontentloaded" });

                const postedAt = await page.evaluate(() => {
                    const scripts = document.querySelectorAll(
                        "script[type='application/ld+json']"
                    );

                    for (let script of scripts) {
                        try {
                            const data = JSON.parse(script.innerText);
                            if (data.datePosted) return data.datePosted;
                        } catch { }
                    }
                    return null;
                });

                enrichedJobs.push({
                    ...job,
                    company: "Okta",
                    location: "Bangalore",
                    postedAt
                });

            } catch {
                enrichedJobs.push({
                    ...job,
                    company: "Okta",
                    location: "Bangalore",
                    postedAt: null
                });
            }
        }

        await browser.close();

        return enrichedJobs;

    } catch (err) {
        console.log("❌ Okta fetch error:", err.message);
        return [];
    }
}

module.exports = fetchOkta;