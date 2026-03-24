function isRelevant(job) {
    const title = (job.title || job.name || "").toLowerCase();
    const department = (job.department?.name || "").toLowerCase();

    const isEngineeringDept =
        department.includes("engineering") ||
        department.includes("eng") ||
        department.includes("product engineering");

    return (

        (
            title.includes("frontend") ||
            title.includes("front-end") ||
            title.includes("web") ||
            title.includes("ui") ||
            title.includes("full stack") ||
            title.includes("fullstack") ||
            title.includes("software engineer III")
        ) ||
        isEngineeringDept &&
        (
            title.includes("engineer") ||
            title.includes("developer")
        ) &&
        !title.includes("staff") &&
        !title.includes("principal") &&
        !title.includes("director") &&
        !title.includes("backend")
        && !title.includes("manager")
    );
}


function isRecent(job) {
    if (!job.postedAt) return true; // allow Google/Microsoft

    const posted = new Date(job.postedAt);
    const now = new Date();

    const diffDays =
        (now - posted) / (1000 * 60 * 60 * 24);

    return diffDays <= 5;
}

function isIndia(job) {
    if (!job.location) return false;

    const loc = job.location.toLowerCase();

    // Explicit India locations
    const indiaMatch =
        loc.includes("india") ||
        loc.includes("bangalore") ||
        loc.includes("bengaluru") ||
        loc.includes("hyderabad") ||
        loc.includes("gurgaon") ||
        loc.includes("gurugram") ||
        loc.includes("noida") ||
        loc.includes("pune") ||
        loc.includes("mumbai") ||
        loc.includes("delhi") ||
        loc.includes("chennai");

    // Remote roles that might include India
    const remoteMatch =
        loc.includes("remote") &&
        (loc.includes("india") || loc.includes("apac") || loc.includes("asia"));

    return indiaMatch || remoteMatch;
}


module.exports = { isRelevant, isRecent, isIndia };