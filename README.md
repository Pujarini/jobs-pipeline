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

### Pipeline Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. FETCH - Get Jobs from All Companies (Parallel)      │
│    ├── Google (API)                                     │
│    ├── Uber (API)                                       │
│    ├── Okta (Puppeteer)                                 │
│    └── ... (9 more sources)                             │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ 2. CONSOLIDATE - Combine All Jobs into Single Array    │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ 3. FILTER - Remove Irrelevant Jobs                      │
│    ├── isRelevant() → Check title & department         │
│    ├── isRecent() → Jobs posted in last 5 days         │
│    └── isIndia() → Location must be in India           │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ 4. SORT - Order by Most Recent First                    │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ 5. BATCH - Divide into Groups of 10                     │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ 6. NOTIFY - Send to Telegram (1 min delay between)      │
│    ├── Format with emojis & time indicators             │
│    ├── Include title, company, location, link           │
│    └── Add recency badge (🔥 24H, ⚡ 48H, etc)          │
└─────────────────────────────────────────────────────────┘
```

### Filtering Logic

**isRelevant()** - Checks job title and department:
- ✅ Includes: "frontend", "front-end", "web", "ui", "full stack", "fullstack", "software engineer III"
- ✅ OR: Engineering department + ("engineer" or "developer")
- ❌ Excludes: "staff", "principal", "director", "backend", "manager"

**isRecent()** - Checks posting date:
- ✅ Jobs posted within last **5 days**
- ✅ Special case: Google/Microsoft jobs without `postedAt` are allowed

**isIndia()** - Checks location:
- ✅ **Explicit India locations**: Bangalore, Bengaluru, Hyderabad, Gurgaon, Gurugram, Noida, Pune, Mumbai, Delhi, Chennai
- ✅ **Remote roles**: Remote + (India/APAC/Asia)

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

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
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

## 📁 Project Structure

```
jobs-pipeline/
│
├── index.js                  # 📌 Main orchestrator
├── config.js                 # ⚙️  Configuration (empty - customize here)
├── package.json              # 📦 Dependencies
├── package-lock.json         # 🔒 Locked versions
│
├── fetchers/                 # 🌐 Job sources
│   ├── google.js             # Google API
│   ├── uber.js               # Uber REST API
│   ├── okta.js               # Okta (Puppeteer)
│   ├── microsoft.js          # Microsoft API
│   ├── atlassian.js          # Atlassian API
│   ├── rippling.js           # Rippling HTML parsing
│   ├── booking.js            # Booking.com API
│   ├── deel.js               # Deel HTML parsing
│   ├── apple.js              # Apple (Puppeteer)
│   ├── greenhouse.js         # Greenhouse API template
│   └── lever.js              # Lever API placeholder
│
├── notifier/                 # 📨 Notification channels
│   └── telegram.js           # Telegram Bot sender
│
├── utils/                    # 🛠️  Utilities
│   ├── filter.js             # Filter logic (isRelevant, isRecent, isIndia)
│   ├── scorer.js             # Score jobs by recency
│   └── time.js               # Time formatting utilities
│
└── .github/                  # GitHub workflows (optional)
```

## ⚙️ Configuration

### Environment Variables (.env)

| Variable | Required | Description |
|---|---|---|
| `TG_TOKEN` | ✅ Yes | Telegram bot API token |
| `TG_CHAT_ID` | ✅ Yes | Telegram chat/user ID |

### Filter Customization (utils/filter.js)

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

## 🔧 Customization

### Adding a New Company Job Source

#### Step 1: Create a new fetcher file

Create `fetchers/example.js`:

```javascript
const axios = require('axios');

async function fetchExample() {
    try {
        const response = await axios.get(
            'https://example-company.com/api/jobs',
            { timeout: 10000 }
        );
        
        return response.data.jobs.map(job => ({
            title: job.title,
            company: 'Example Company',
            location: job.location,
            url: job.application_url,
            postedAt: job.posted_date,
            department: { name: job.department }
        }));
    } catch (error) {
        console.error('Error fetching Example jobs:', error.message);
        return [];
    }
}

module.exports = fetchExample;
```

#### Step 2: Import in index.js

```javascript
const fetchExample = require("./fetchers/example");
```

#### Step 3: Add to Promise.all()

```javascript
const [
    ...otherJobs,
    exampleJobs
] = await Promise.all([
    ...otherFetchers,
    fetchExample()
]);
```

#### Step 4: Add to jobs array

```javascript
jobs.push(...exampleJobs);
```

### Using Puppeteer for JavaScript-Heavy Sites

If a website renders content dynamically:

```javascript
const puppeteer = require('puppeteer');

async function fetchDynamicSite() {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto('https://example.com/careers');
        
        const jobs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.job-item')).map(el => ({
                title: el.querySelector('.job-title')?.textContent?.trim(),
                location: el.querySelector('.job-location')?.textContent?.trim(),
                url: el.href
            }));
        });
        
        return jobs;
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = fetchDynamicSite;
```

### Using Cheerio for HTML Parsing

For static HTML sites:

```javascript
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchStaticSite() {
    try {
        const { data } = await axios.get('https://example.com/jobs');
        const $ = cheerio.load(data);
        
        const jobs = [];
        $('div.job-card').each((i, el) => {
            jobs.push({
                title: $(el).find('.title').text().trim(),
                company: 'Example Company',
                location: $(el).find('.location').text().trim(),
                url: $(el).find('a').attr('href'),
                postedAt: $(el).find('.date').attr('data-timestamp')
            });
        });
        
        return jobs;
    } catch (error) {
        console.error('Error fetching:', error.message);
        return [];
    }
}

module.exports = fetchStaticSite;
```

### Changing Notification Channels

**Email Notifications (using Nodemailer):**

```bash
npm install nodemailer
```

```javascript
const nodemailer = require('nodemailer');

async function sendJobsEmail(jobs) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    const htmlContent = jobs.map(j => 
        `<div>
            <h3>${j.title}</h3>
            <p>${j.company} • ${j.location}</p>
            <a href="${j.url}">Apply Here</a>
        </div>`
    ).join('');
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `🔥 ${jobs.length} New Frontend Jobs!`,
        html: htmlContent
    });
}

module.exports = sendJobsEmail;
```

**Discord Webhooks:**

```javascript
const axios = require('axios');

async function sendJobsDiscord(jobs) {
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    
    const embeds = jobs.map(job => ({
        title: job.title,
        description: `${job.company} • ${job.location}`,
        url: job.url,
        color: 16711680 // Red for hot jobs
    }));
    
    await axios.post(WEBHOOK_URL, { embeds });
}

module.exports = sendJobsDiscord;
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue: `Cannot find module 'dotenv'`

**Solution:**
```bash
npm install dotenv
```

#### Issue: `TG_TOKEN is undefined` or `Telegram API Error`

**Solution:**
1. Verify `.env` file exists in root directory
2. Check token format: `123456:ABC...`
3. Verify bot token with: 
   ```bash
   curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe
   ```
4. Make sure you're not using quotes in `.env`:
   ```env
   # ❌ Wrong
   TG_TOKEN="123456:ABC"
   
   # ✅ Correct
   TG_TOKEN=123456:ABC
   ```

#### Issue: `Jobs fetched: 0` - Nothing being scraped

**Solution:**
1. Check your internet connection
2. Verify API endpoints are still active:
   ```bash
   curl https://google.com/careers (or relevant company)
   ```
3. Check if company changed their page structure
4. Run individual fetchers for debugging:
   ```bash
   node -e "require('./fetchers/google.js')().then(jobs => console.log(jobs.length))"
   ```

#### Issue: Puppeteer crashes / "Failed to launch browser"

**Solution:**
```bash
# Install missing dependencies (Linux)
sudo apt-get install libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libxss1 libasound2

# Or use --no-sandbox flag in puppeteer config
```

#### Issue: Telegram message not received

**Solution:**
1. Verify chat ID is correct:
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
2. Check that bot has permission to send to chat
3. Try sending message manually:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
     -d "chat_id=<CHAT_ID>&text=Test"
   ```

#### Issue: Filter removing all jobs

**Solution:**
1. Temporarily disable filters to test:
   ```javascript
   const filtered = jobs; // Comment out actual filter
   ```
2. Log job properties to understand structure:
   ```javascript
   console.log(JSON.stringify(jobs[0], null, 2));
   ```
3. Adjust filter criteria in `utils/filter.js`

#### Issue: `ECONNREFUSED` or timeout errors

**Solution:**
1. Check internet connectivity
2. Increase timeout in fetchers:
   ```javascript
   { timeout: 30000 } // 30 seconds
   ```
3. Add retry logic:
   ```javascript
   async function fetchWithRetry(fn, retries = 3) {
       for (let i = 0; i < retries; i++) {
           try {
               return await fn();
           } catch (err) {
               if (i === retries - 1) throw err;
               await new Promise(r => setTimeout(r, 1000 * (i + 1)));
           }
       }
   }
   ```

### Debug Mode

Enable detailed logging:

```javascript
// In index.js
const DEBUG = process.env.DEBUG === 'true';

if (DEBUG) {
    console.log('Fetching jobs...');
    console.log(`Found ${jobs.length} total jobs`);
    console.log(`After filter: ${filtered.length} jobs`);
    console.log('Sample filtered job:', filtered[0]);
}
```

Run with debug:
```bash
DEBUG=true npm start
```

## 🔐 Security Best Practices

✅ **Do:**
- Store sensitive data in `.env` (never commit)
- Keep bot token private
- Use environment variables for all credentials
- Rotate API tokens regularly
- Limit bot permissions in Telegram

❌ **Don't:**
- Commit `.env` file to Git
- Share bot tokens publicly
- Hardcode credentials
- Log sensitive information
- Use weak/shared bot tokens

## 📊 Performance Tips

1. **Parallel Fetching**: Pipeline already uses `Promise.all()` to fetch from all companies simultaneously
2. **Batch Sending**: Jobs are sent in batches to avoid flooding Telegram
3. **Timeout Handling**: Set appropriate timeouts for different APIs:
   ```javascript
   // Fast APIs
   { timeout: 5000 }
   
   // Slow/browser-based
   { timeout: 30000 }
   ```
4. **Caching**: Add job caching to avoid duplicates:
   ```javascript
   const seenUrls = new Set();
   const unique = jobs.filter(j => {
       if (seenUrls.has(j.url)) return false;
       seenUrls.add(j.url);
       return true;
   });
   ```

## 📅 Scheduling (Optional)

Run pipeline on schedule using cron:

**Linux/Mac:**
```bash
# Every day at 9 AM
0 9 * * * cd /path/to/jobs-pipeline && npm start

# Every 6 hours
0 */6 * * * cd /path/to/jobs-pipeline && npm start
```

**Docker (optional):**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
```

```bash
docker build -t jobs-pipeline .
docker run --env-file .env jobs-pipeline
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
