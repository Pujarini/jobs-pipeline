function getTimeAgo(dateString) {
    if (!dateString) return "Unknown";

    const posted = new Date(dateString);
    const now = new Date();

    const diffMs = now - posted;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

module.exports = getTimeAgo;