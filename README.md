# 🎯 Jobs Pipeline

A Node.js automation pipeline that fetches job listings from major tech company career pages and identifies relevant opportunities for you in India.

## 📌 Table of Contents

- [Purpose](#purpose)
- [Supported Companies](#-supported-companies)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## Purpose

This project helps you discover job opportunities from top tech companies by:
- ✅ Automatically scraping job listings from 11+ company career pages
- ✅ Filtering for relevant positions based on your criteria
- ✅ Identifying recent postings in India
- ✅ Sending curated job alerts via Telegram
- ✅ Scoring jobs by recency (hottest jobs first)

Perfect for job seekers looking to stay ahead of the competition and discover opportunities before they're widely advertised!

## 🏢 Supported Companies

The pipeline currently fetches jobs from:
1. **Google** - Generic Job Opening API
2. **Uber** - REST API scraping
3. **Okta** - Puppeteer (JavaScript-heavy site)
4. **Microsoft** - REST API scraping
5. **Atlassian** - REST API scraping
6. **Rippling** - HTML parsing with Cheerio
7. **Booking.com** - REST API scraping
8. **Deel** - HTML parsing with Cheerio
9. **Apple** - Puppeteer automation
10. **Greenhouse** - Greenhouse API (template)
11. **Lever** - Lever API (placeholder)

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **axios** (`^1.13.6`) | HTTP requests & API calls |
| **cheerio** (`^1.2.0`) | HTML parsing & DOM traversal |
| **puppeteer** (`^24.40.0`) | Headless browser automation |
| **dotenv** (`^17.3.1`) | Environment variable management |

## 🔄 How It Works

### Job Scoring

Jobs are scored by recency (used in Telegram notifications):
| Days Old | Score | Badge |
|---|---|---|
| ≤ 1 day | 100 | 🔥 LAST 24H |
| ≤ 2 days | 90 | - |
| ≤ 3 days | 80 | - |
| ≤ 4 days | 70 | - |
| ≤ 5 days | 60 | 🕒 THIS WEEK |

## 🚀 Getting Started

### Prerequisites

Before you start, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Telegram Bot** with API token (see Setup Step 3)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Pujarini/jobs-pipeline.git
cd jobs-pipeline
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- axios - for HTTP requests
- cheerio - for HTML parsing
- puppeteer - for browser automation
- dotenv - for environment variables

Verify installation:
```bash
npm list
```

### Step 3: Set Up Telegram Bot

**Create a Telegram Bot:**

1. Open Telegram and search for **@BotFather**
2. Send `/start` command
3. Send `/newbot` command
4. Follow prompts to create a bot (give it a name like "JobsPipeline")
5. **Copy the bot token** provided (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

**Get Your Chat ID:**

1. Message your bot anything
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Replace `<YOUR_BOT_TOKEN>` with your actual token
4. Find your `chat_id` from the JSON response

### Step 4: Create Environment Variables File

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your Telegram credentials:

```env
TG_TOKEN=your_telegram_bot_token_here
TG_CHAT_ID=your_telegram_chat_id_here
```

**Example .env file:**
```env
TG_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TG_CHAT_ID=987654321
```

⚠️ **IMPORTANT**: Add `.env` to `.gitignore` (already done in this repo)

### Step 5: Customize Configuration

Edit `config.js` to set your job preferences:

```javascript
module.exports = {
  // Job title keywords to match
  keywords: [
    'frontend',
    'web',
    'full stack',
    'ui'
  ],
  
  // Exclude these keywords
  excludeKeywords: [
    'staff',
    'principal',
    'backend'
  ],
  
  // Target locations
  locations: [
    'bangalore',
    'hyderabad',
    'remote'
  ],
  
  // Maximum days old
  maxDaysOld: 5,
  
  // Batch size for Telegram
  batchSize: 10,
  
  // Delay between batches (in ms)
  batchDelay: 60000 // 1 minute
};
```

### Step 6: Verify Setup

Test your environment setup:

```bash
node -e "console.log('Node.js ✓'); require('dotenv').config(); console.log('Env loaded ✓')"
```

Check if dependencies are available:

```bash
npm list axios cheerio puppeteer dotenv
```

### Step 7: Run the Pipeline

```bash
npm start
```

Or directly:

```bash
node index.js
```

**Expected Output:**

```
Total jobs fetched: 245
After filter: 18
Sending 2 batches
Sending batch 1
Sending batch 2
Done!
```

## ⚙️ Configuration


**Modify isRelevant() to match your interests:**

```javascript
function isRelevant(job) {
    const title = (job.title || job.name || "").toLowerCase();
    
    return (
        title.includes("frontend") ||
        title.includes("full stack") ||
        title.includes("web developer")
        // Add more conditions here
    ) && !title.includes("senior") && !title.includes("lead");
}
```

**Modify isRecent() for different time windows:**

```javascript
function isRecent(job) {
    if (!job.postedAt) return true;
    const posted = new Date(job.postedAt);
    const now = new Date();
    const diffDays = (now - posted) / (1000 * 60 * 60 * 24);
    return diffDays <= 7; // Change from 5 to 7 days
}
```

**Modify isIndia() to target different regions:**

```javascript
function isIndia(job) {
    const loc = job.location.toLowerCase();
    
    return (
        loc.includes("bangalore") ||
        loc.includes("remote") ||
        // Add more locations
    );
}
```

### Telegram Message Customization (notifier/telegram.js)

Change the message template:

```javascript
async function sendJobs(jobs) {
    let message = "��� *FRONTEND JOBS ALERT*\n\n";
    
    jobs.forEach(job => {
        message += `*${job.title}*\n`;
        message += `_${job.company}_\n`;
        message += `📍 ${job.location}\n`;
        message += `🔗 [Apply Here](${job.url})\n\n`;
    });
    
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown"
    });
}
```
## 🤝 Contributing

Contributions welcome! Please:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** changes: `git commit -m "Add my feature"`
4. **Push** to branch: `git push origin feature/my-feature`
5. **Create** a Pull Request

### Areas to Contribute:

- ✅ Add new company job fetchers
- ✅ Improve filter algorithms
- ✅ Optimize scraping performance
- ✅ Add new notification channels
- ✅ Better error handling
- ✅ Add tests
- ✅ Improve documentation

## 📝 License

ISC License - See LICENSE file for details

## 👤 Author

Created by [Pujarini](https://github.com/Pujarini)

## ⭐ Show Your Support

If this project helped you, please:
- ⭐ Star this repository
- 🍴 Fork it
- 📢 Share with others
- 💬 Give feedback

## 📞 Support & Questions

- 📧 Open an Issue for bugs
- 💡 Discussions for questions
- 🐛 Report security issues privately

---

**Happy job hunting! 🎉** May the best opportunities find you! 🚀
