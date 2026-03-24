require("dotenv").config();
const axios = require("axios");
const getTimeAgo = require("../utils/time");

const TOKEN = process.env.TG_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

async function sendJobs(jobs) {
    let message = "🔥 Frontend Jobs\n\n";

    jobs.forEach(job => {
        const hours =
            job.postedAt
                ? (new Date() - new Date(job.postedAt)) / (1000 * 60 * 60)
                : null;

        message += `💼 ${job.title}\n`;
        message += `🏢 ${job.company}\n`;
        message += `📍 ${job.location}\n`;
        message += `⏱️ ${getTimeAgo(job.postedAt)}\n`;

        if (hours !== null) {
            if (hours <= 24) message += "🔥 LAST 24H\n";
            else if (hours <= 48) message += "⚡ LAST 48H\n";
            else if (hours <= 120) message += "🕒 THIS WEEK\n";
        }

        message += `🔗 ${job.url}\n\n`;
    });

    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message
    });
}

module.exports = sendJobs;