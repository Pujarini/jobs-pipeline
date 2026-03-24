function score(job) {
    if (!job.postedAt) return 0;

    const hours =
        (new Date() - new Date(job.postedAt)) / (1000 * 60 * 60);

    const days = hours / 24;

    if (days <= 1) return 100;   // 🔥 last 24h
    if (days <= 2) return 90;
    if (days <= 3) return 80;
    if (days <= 4) return 70;
    if (days <= 5) return 60;

    return 0;
}

module.exports = score;