const puppeteer = require("puppeteer");

async function fetchDeel() {
    const url =
        "https://www.deel.com/careers/open-roles/?location=India&team=Engineering";

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });

        // wait for jobs to load
        await new Promise(r => setTimeout(r, 4000));

        const jobs = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll("a"));

            return elements
                .map(el => ({
                    title: el.innerText.trim(),
                    url: el.href
                }))
                .filter(j =>
                    j.title &&
                    j.url &&
                    (
                        j.title.toLowerCase().includes("engineer") ||
                        j.title.toLowerCase().includes("developer")
                    )
                );
        });

        // ⚠️ remove duplicates (important)
        const uniqueJobs = Array.from(
            new Map(jobs.map(j => [j.url, j])).values()
        );


        console.log("Deel raw jobs:", uniqueJobs.length);

        return uniqueJobs.map(job => ({
            ...job,
            company: "Deel",
            location: "India",
            postedAt: null // Deel rarely exposes this reliably
        }));

    } catch (err) {
        console.log("❌ Deel fetch error:", err.message);
        return [];
    }
}

module.exports = fetchDeel;