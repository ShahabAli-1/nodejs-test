// config.js
require("dotenv").config();

module.exports = {
  apiKey: process.env.CALENDARIFIC_API_KEY,
  baseUrl: "https://calendarific.com/api/v2",
  cacheTtl: 3600,
};
