// test/api.test.js
const request = require("supertest");
const app = require("../index.js");
const axios = require("axios");

jest.mock("axios"); // Mock axios to control API responses

describe("GET /holidays", () => {
  it("should return holidays for a given country and year", async () => {
    const mockHolidays = [{ name: "New Year", date: "2024-01-01" }];
    axios.get.mockResolvedValue({
      data: { response: { holidays: mockHolidays } },
    });

    const res = await request(app).get("/holidays?country=PK&year=2024");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockHolidays);
  });

  it("should return 400 if country or year is missing", async () => {
    const res = await request(app).get("/holidays?country=PK");

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("Country and year are required parameters.");
  });
});

describe("GET /countries", () => {
  it("should return a list of countries", async () => {
    const mockCountries = [{ country_name: "Pakistan", iso_3166: "PK" }];
    axios.get.mockResolvedValue({
      data: { response: { countries: mockCountries } },
    });

    const res = await request(app).get("/countries");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockCountries);
  });
});
