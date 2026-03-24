const puppeteer = require("puppeteer");

async function fetchUber() {
    const url =
        "https://www.uber.com/in/en/careers/list/?department=Engineering&location=IND-Karn%C4%81taka-Bangalore&team=Frontend";

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    const jobs = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll("a[href*='/careers/list/']")
        ).map(el => ({
            title: el.innerText.trim(),
            url: "https://www.uber.com" + el.getAttribute("href")
        }));
    });

    // 🔥 NEW: visit each job page
    const enrichedJobs = [];

    for (const job of jobs) {
        try {
            await page.goto(job.url, { waitUntil: "domcontentloaded" });

            const postedAt = await page.evaluate(() => {
                const scripts = document.querySelectorAll("script[type='application/ld+json']");

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
                company: "Uber",
                location: "Bangalore",
                postedAt
            });

        } catch (err) {
            enrichedJobs.push({
                ...job,
                company: "Uber",
                location: "Bangalore",
                postedAt: null
            });
        }
    }

    await browser.close();

    return enrichedJobs;
}

module.exports = fetchUber;