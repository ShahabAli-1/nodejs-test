// index.js
const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const config = require("./config");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const cache = new NodeCache({ stdTTL: config.cacheTtl });

app.get("/holidays", async (req, res) => {
  const { country, year } = req.query;

  if (!country || !year) {
    return res
      .status(400)
      .json({ error: "Country and year are required parameters." });
  }

  const cacheKey = `holidays_${country}_${year}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(`${config.baseUrl}/holidays`, {
      params: {
        api_key: config.apiKey,
        country: country,
        year: year,
      },
    });

    const holidays = response.data.response.holidays;
    cache.set(cacheKey, holidays);
    res.json(holidays);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch holidays from the Calendarific API." });
  }
});

app.get("/countries", async (req, res) => {
  const cacheKey = "countries";
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(`${config.baseUrl}/countries`, {
      params: {
        api_key: config.apiKey,
      },
    });

    const countries = response.data.response.countries;
    cache.set(cacheKey, countries);
    res.json(countries);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch countries from the Calendarific API." });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
