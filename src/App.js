// React imports
import React, { useState, useEffect } from "react";
// Pages + Components
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import ChartComponent from "./components/ChartComponent";
// Styles
import "./styles/main.css";
import "./styles/dashboard.css";

// Backend URL and API Key from environment files
const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const API_KEY = process.env.REACT_APP_API_KEY || "dev_fallback_key";

function App() {
  // App states
  const [isLoggedIn, setIsLoggedIn] = useState(false);// check user login state
  const [country, setCountry] = useState("");// user input country name
  const [records, setRecords] = useState([]);// all saved records from database
  const [preview, setPreview] = useState(null);// preview data before saving
  const [loading, setLoading] = useState(false);// show loading text during fetch

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      loadRecords();
    }
    // we intentionally don't include `token` as dependency to avoid repeated calls;
    // a better approach is to manage auth state via context or an auth hook
    // and reload records when login occurs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    loadRecords();
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRecords([]);
    setPreview(null);
    setCountry("");
  };

  // ---------------- FETCH + AGGREGATE ----------------
  const fetchAndPreview = async () => {
    if (!country) return alert("Enter a country");

    try {
      setLoading(true);
      const cleanCountry = country.trim();

      // Fetch COVID data
      const covidRes = await fetch(`${BACKEND}/api/external/covid/${encodeURIComponent(cleanCountry)}`, {
        headers: { "x-api-key": API_KEY },
      });
      const covid = await covidRes.json();

      // Fetch Travel advisory data
      const travelRes = await fetch(`${BACKEND}/api/external/travel/${encodeURIComponent(cleanCountry)}`, {
        headers: { "x-api-key": API_KEY },
      });
      const travel = await travelRes.json();

      // Fetch flag from REST Countries API (fallback)
      let flagUrl = "";
      try {
        if (cleanCountry.toLowerCase() === "india") {
          flagUrl = "https://flagcdn.com/w320/in.png";
        } else {
          const countryDataRes = await fetch(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(cleanCountry)}?fullText=true`
          );
          const countryData = await countryDataRes.json();
          flagUrl = countryData?.[0]?.flags?.png || "";
        }
      } catch (err) {
        flagUrl = "";
      }

      // Defensive aggregation
      const aggregated = {
        country: covid?.country || cleanCountry,
        timestamp: new Date().toISOString(),
        covid: {
          cases: covid?.cases ?? null,
          deaths: covid?.deaths ?? null,
          recovered: covid?.recovered ?? null,
          flag: flagUrl || covid?.flag || ""
        },
        travel: {
          advisoryText: travel?.advisoryText ?? travel?.message ?? "",
          advisoryScore: (travel?.advisoryScore ?? travel?.score) ?? null,
          raw: travel ?? {}
        }
      };

      setPreview(aggregated);
    } catch (err) {
      console.error(err);
      alert("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SAVE TO BACKEND ----------------
  const saveRecord = async () => {
    if (!preview) return alert("No preview data");

    try {
      const res = await fetch(`${BACKEND}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preview),
      });

      const respJson = await res.json();

      if (!res.ok) {
        console.error("Save failed:", respJson);
        alert(respJson.error || "Failed to save");
        return;
      }

      alert("Saved Successfully");
      loadRecords();
      setPreview(null);
      setCountry(""); // optional UX improvement
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  // ---------------- LOAD RECORDS ----------------
  const loadRecords = async () => {
    try {
      const res = await fetch(`${BACKEND}/records`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRecords(data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- RENDER ----------------
  if (!isLoggedIn) return <Landing onLogin={handleLogin} />;

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <div className="dashboard-container">
        {/* Add Country Section */}
        <div className="add-country-box">
          <h2>Add New Country Data</h2>
          <input
            type="text"
            placeholder="Enter country name..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <button onClick={fetchAndPreview}>
            {loading ? "Loading..." : "Fetch & Preview"}
          </button>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="preview-box">
            <h3>Preview Data</h3>
            <Card
              country={preview.country}
              cases={preview.covid.cases}
              deaths={preview.covid.deaths}
              recovered={preview.covid.recovered}
              flag={preview.covid?.flag}
              advisoryText={preview.travel.advisoryText}
              advisoryScore={preview.travel.advisoryScore}
            />
            <div style={{ marginTop: 10 }}>
              <button onClick={saveRecord}>Save to Database</button>
            </div>
          </div>
        )}

        {/* Dashboard Section */}
        <div className="card-grid">
          {records.map((item) => (
            <Card
              key={item._id}
              country={item.country}
              cases={item.covid?.cases}
              deaths={item.covid?.deaths}
              recovered={item.covid?.recovered}
              flag={item.covid?.flag}
              advisoryText={item.travel?.advisoryText}
              advisoryScore={item.travel?.advisoryScore}
            />
          ))}
        </div>

        {/* Chart receives `data` prop (records) */}
        <ChartComponent data={records} />
      </div>
    </>
  );
}

export default App;
