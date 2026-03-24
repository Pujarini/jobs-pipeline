const axios = require("axios");

async function fetchAtlassian() {
    try {
        const res = await axios.post(
            "https://api.atlassian.com/graphql",
            {
                query: `
                query Jobs {
                  jobs(
                    first: 50
                    where: {
                      teams: ["Engineering"]
                      locations: ["India"]
                    }
                  ) {
                    edges {
                      node {
                        id
                        title
                        locationNames
                        postedAt
                        absoluteUrl
                      }
                    }
                  }
                }
                `
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const jobs = res.data?.data?.jobs?.edges || [];

        return jobs.map(({ node }) => ({
            company: "Atlassian",
            title: node.title,
            location: node.locationNames?.join(", ") || "India",
            url: node.absoluteUrl,
            postedAt: node.postedAt
        }));
    } catch (e) {
        console.error("Error fetching Atlassian", e.message);
        return [];
    }
}

module.exports = fetchAtlassian;