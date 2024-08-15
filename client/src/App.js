import React, { useState } from "react";
import axios from "axios";

function App() {
  const [country, setCountry] = useState("PK");
  const [year, setYear] = useState("2024");
  const [holidays, setHolidays] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");

  const fetchHolidays = async () => {
    try {
      setError("");
      const response = await axios.get("http://localhost:9000/holidays", {
        params: { country, year },
      });
      setHolidays(response.data);
    } catch (error) {
      setError("Failed to fetch holidays.");
    }
  };

  const fetchCountries = async () => {
    try {
      setError("");
      const response = await axios.get("http://localhost:9000/countries");
      setCountries(response.data);
    } catch (error) {
      setError("Failed to fetch countries.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Holiday Fetcher</h1>
      <div>
        <h2>Select Country and Year</h2>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country Code"
        />
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
        />
        <button onClick={fetchHolidays}>Fetch Holidays</button>
      </div>

      <div>
        <h2>Supported Countries</h2>
        <button onClick={fetchCountries}>Fetch Countries</button>
        <ul>
          {countries.map((country, index) => (
            <li key={index}>
              {country["country_name"]} ({country["iso-3166"]})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Holidays</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {holidays.map((holiday, index) => (
            <li key={index}>
              {holiday.name} - {holiday.date.iso}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
