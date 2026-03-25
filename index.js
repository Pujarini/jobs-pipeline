const fetchUber = require("./fetchers/uber");
const fetchOkta = require("./fetchers/okta");
const fetchMicrosoft = require("./fetchers/microsoft");
const fetchGoogle = require("./fetchers/google");
const fetchAtlassian = require("./fetchers/atlassian");
const fetchRippling = require("./fetchers/rippling");
const fetchBooking = require("./fetchers/booking");
const fetchDeel = require("./fetchers/deel");
const fetchApple = require("./fetchers/apple");

const { isRelevant, isRecent, isIndia } = require("./utils/filter");
const sendJobs = require("./notifier/telegram");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function chunkJobs(jobs, size = 10) {
    const chunks = [];
    for (let i = 0; i < jobs.length; i += size) {
        chunks.push(jobs.slice(i, i + size));
    }
    return chunks;
}

async function run() {
    let jobs = [];


    const [
        uberJobs,
        oktaJobs,
        microsoftJobs,
        googleJobs,
        atlassianJobs,
        ripplingJobs,
        bookingJobs,
        deelJobs,
        appleJobs
    ] = await Promise.all([
        fetchUber(),
        fetchOkta(),
        fetchMicrosoft(),
        fetchGoogle(),
        fetchAtlassian(),
        fetchRippling(),
        fetchBooking(),
        fetchDeel(),
        fetchApple()
    ]);

    jobs.push(
        ...googleJobs,
        ...uberJobs,
        ...oktaJobs,
        ...microsoftJobs,
        ...atlassianJobs,
        ...ripplingJobs,
        ...bookingJobs,
        ...deelJobs,
        ...appleJobs
    );

    console.log("Total jobs fetched:", jobs.length);

    const filtered = jobs.filter(
        j => isRelevant(j) && isRecent(j) && isIndia(j)
    );

    console.log("After filter:", filtered.length);

    // Sort by recency
    const sorted = filtered.sort(
        (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
    );

    // Chunk into batches of 10
    const batches = chunkJobs(sorted, 10);

    console.log(`Sending ${batches.length} batches`);

    for (let i = 0; i < batches.length; i++) {
        console.log(`Sending batch ${i + 1}`);

        await sendJobs(batches[i]);

        // wait 5 minutes before next batch
        if (i < batches.length - 1) {
            await sleep(60 * 1000); // 1 min
        }
    }
}

run()
    .then(() => {
        console.log("Done!");
        process.exit(0); // 👈 force exit
    })
    .catch((err) => {
        console.error("Error:", err);
        process.exit(1);
    });