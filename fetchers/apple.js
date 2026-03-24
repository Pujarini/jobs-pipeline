const puppeteer = require("puppeteer");

async function fetchApple() {
    const url =
        "https://jobs.apple.com/en-in/search?search=Frontend&sort=newest&location=india-INDC";

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });

        // wait for jobs to render
        await new Promise(r => setTimeout(r, 4000));

        const count = await page.$eval(
            "body",
            el => el.innerText.includes("No results") ? "EMPTY" : "HAS_CONTENT"
        );

        const jobs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("a[href*='/details/']"))
                .map(el => ({
                    title: el.innerText.trim().split("\n")[0],
                    url: el.href
                }))
                // Drop the "See full role description" noise
                .filter(j => j.title && !j.title.toLowerCase().includes("see full"));
        });

        // Dedup by URL — now safe since junk titles are already gone
        const uniqueJobs = Array.from(
            new Map(jobs.map(j => [j.url, j])).values()
        );

        // Optional: tighten to actual frontend roles
        const FRONTEND_KEYWORDS = [
            "frontend", "front end", "front-end",
            "ui engineer",
            "react", "angular", "vue", "javascript",
            "full stack", "fullstack", "full-stack"
        ];

        const filteredJobs = uniqueJobs.filter(j =>
            FRONTEND_KEYWORDS.some(kw => j.title.toLowerCase().includes(kw))
        );


        console.log("Apple jobs fetched:", uniqueJobs.length);


        return filteredJobs.map(job => ({
            ...job,
            company: "Apple",
            location: "India",
            postedAt: null // ❌ Apple doesn't expose reliably
        }));

    } catch (err) {
        console.log("❌ Apple fetch error:", err.message);
        return [];
    }
}

module.exports = fetchApple;