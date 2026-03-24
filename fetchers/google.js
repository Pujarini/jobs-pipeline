const puppeteer = require("puppeteer");

async function fetchGoogle() {
    const url =
        "https://www.google.com/about/careers/applications/jobs/results?target_level=MID&employment_type=FULL_TIME&location=India&q=%22Software%20Engineer%20III%22";

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });

        // wait for job list to render
        await page.waitForSelector("li.lLd3Je", { timeout: 10000 });

        const jobs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("li.lLd3Je"))
                .map(el => {
                    const titleEl = el.querySelector("h3");
                    const linkEl = el.querySelector("a");

                    return {
                        title: titleEl ? titleEl.innerText.trim() : "",
                        url: linkEl ? linkEl.href : ""
                    };
                })
                .filter(j => j.title && j.url);
        });

        await browser.close();

        return jobs.map(j => ({
            ...j,
            company: "Google",
            location: "India",
            postedAt: null
        }));

    } catch (err) {
        console.log("❌ Google fetch error:", err.message);
        return [];
    }
}

module.exports = fetchGoogle;