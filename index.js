require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const axios = require("axios");
const Record = require("./models/Record");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

/* ---------------- CORS (Allow Frontend to Connect) ---------------- */
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
app.use(
  cors({
    origin: FRONTEND_URL === "*" ? true : FRONTEND_URL,
  })
);

app.use(passport.initialize());

/* ---------------- CONNECT TO MONGO DATABASE ---------------- */
// Connects to MongoDB using the link in .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

/* ---------------- API KEY CHECK (For Frontend) ---------------- */
// Checks if request has correct x-api-key header
function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) return res.status(401).json({ error: "Missing API Key" });
  if (!process.env.API_KEY)
    return res.status(500).json({ error: "Server missing API_KEY" });

  if (apiKey !== process.env.API_KEY)
    return res.status(401).json({ error: "Invalid API Key" });

  next();
}

/* ---------------- JWT CHECK (User Logged In or Not) ---------------- */
// Verifies user token and allows protected routes
function checkJwt(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* ---------------- VALIDATE SAVED DATA STRUCTURE ---------------- */
// Makes sure saved record has required fields
function validateAggregatedRecord(req, res, next) {
  const { country, timestamp, covid, travel } = req.body;

  if (!country || !timestamp || !covid || !travel) {
    return res
      .status(400)
      .json({ error: "Invalid aggregated structure (missing fields)" });
  }
  next();
}

/* ---------------- AUTH ROUTES ---------------- */
app.use("/auth", authRoutes);

/* ---------------- COVID API (External) ---------------- */
// Gets COVID data from disease.sh API
app.get("/api/external/covid/:country", apiKeyAuth, async (req, res) => {
  try {
    const response = await axios.get(
      `https://disease.sh/v3/covid-19/countries/${req.params.country}`
    );

    res.json({
      country: response.data.country,
      cases: response.data.cases,
      deaths: response.data.deaths,
      recovered: response.data.recovered,
      date: new Date(),
    });
  } catch (err) {
    console.log("COVID API ERROR:", err.message);
    res.status(500).json({ error: "COVID API failed" });
  }
});

/* ---------------- TRAVEL ADVISORY API (NEW WORKING ONE) ---------------- */
// Uses travel-advisory.info API to get advisory score + message
app.get("/api/external/travel/:country", apiKeyAuth, async (req, res) => {
  try {
    const country = req.params.country.toUpperCase();

    // Call travel advisory API
    const travelRes = await axios.get(
      `https://www.travel-advisory.info/api?country=${country}`
    );

    const data = travelRes.data.data[country]?.advisory || {};

    res.json({
      advisoryText: data.message || "No travel advisory available",
      advisoryScore: data.score || null,
    });
  } catch (err) {
    console.log("TRAVEL API ERROR:", err.message);
    res.status(500).json({ error: "Travel advisory API failed" });
  }
});

/* ---------------- CREATE NEW RECORD ---------------- */
// Saves fetched country data into MongoDB
app.post(
  "/records",
  apiKeyAuth,
  checkJwt,
  validateAggregatedRecord,
  async (req, res) => {
    try {
      const rec = await Record.create(req.body);
      res.json({ message: "Saved", id: rec._id });
    } catch (err) {
      console.error("Save record error:", err);
      res.status(500).json({ error: "Failed to save record" });
    }
  }
);

/* ---------------- GET ALL SAVED RECORDS ---------------- */
app.get("/records", apiKeyAuth, checkJwt, async (req, res) => {
  try {
    const records = await Record.find().sort({ timestamp: -1 });
    res.json({ results: records });
  } catch (err) {
    console.error("Get records error:", err);
    res.status(500).json({ error: "Failed to load records" });
  }
});

/* ---------------- UPDATE RECORD ---------------- */
// Update one saved record
app.put(
  "/records/:id",
  apiKeyAuth,
  checkJwt,
  validateAggregatedRecord,
  async (req, res) => {
    try {
      const updated = await Record.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json({ message: "Updated", record: updated });
    } catch (err) {
      console.error("Update record error:", err);
      res.status(500).json({ error: "Failed to update record" });
    }
  }
);

/* ---------------- DELETE RECORD ---------------- */
// Delete a saved record
app.delete("/records/:id", apiKeyAuth, checkJwt, async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete record error:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

/* ---------------- START SERVER ---------------- */
// Starts Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on", PORT));
